
import type {
  CreateTransactionData,
  TransacaoMensal,
  TransacaoMensalResult,
  TransactionArray,
  UpdateTransactionData,
  PaginationQueryParams,
} from './transaction.d.ts';
import type { Transaction, PaginatedTransaction, GroupedByType, GroupedCategories } from '../../shared/types/transaction.d.ts';
import pool from '../../core/config/db.ts'
import { formatCurrency } from '../../shared/formatCurrency.ts';


const checkValidAccount = async (id_account: number, id_usuario: number): Promise<boolean> => {
  const query = `
    SELECT EXISTS(
      SELECT 1 
      FROM contasBancarias 
      WHERE id = $1 AND id_usuario = $2
    ) AS exists
  `;
  const { rows } = await pool.query(query, [id_account, id_usuario]);
  return rows[0].exists
}

const CreateTransaction = async (data: CreateTransactionData): Promise<void> => {
  const { id_contabancaria, nome_transacao, categoria, subcategoria, data_transacao, tipo, valor, natureza, recorrente, frequencia_recorrencia, proxima_ocorrencia, budget_id } = data
  const query = `
    INSERT INTO transacoes 
    (id_contabancaria, nome_transacao, categoria, subcategoria, data_transacao, tipo, valor, natureza , recorrente, frequencia_recorrencia, proxima_ocorrencia, budget_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
  await pool.query(query, [id_contabancaria, nome_transacao, categoria, subcategoria, data_transacao, tipo, valor, natureza, recorrente, frequencia_recorrencia, proxima_ocorrencia, budget_id]);
}

const CreateManyTransactions = async (transactions: TransactionArray): Promise<Partial<TransactionArray[]> | null> => {
  const values: any[] = [];
  const placeholders = transactions.map((transaction, i) => {
    const idx = i * 12;
    values.push(
      transaction.id_contabancaria,
      transaction.nome_transacao,
      transaction.categoria,
      transaction.subcategoria,
      transaction.data_transacao,
      transaction.tipo,
      transaction.valor,
      transaction.natureza,
      transaction.recorrente,
      transaction.frequencia_recorrencia,
      transaction.proxima_ocorrencia,
      transaction.budget_id,
    );

    return `($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5}, $${idx + 6}, $${idx + 7}, $${idx + 8}, $${idx + 9}, $${idx + 10}, $${idx + 11}), $${idx + 12})`;
  }).join(', ');

  const query = `
    INSERT INTO transacoes 
    (id_contabancaria, nome_transacao, categoria, subcategoria, data_transacao, tipo, valor, natureza , recorrente, frequencia_recorrencia, proxima_ocorrencia, budget_id)   
    VALUES ${placeholders}
    RETURNING categoria, nome_transacao, tipo, natureza, valor, data_transacao;
  `;

  const { rows } = await pool.query(query, values);

  if (rows.length === 0) return null;

  return rows
};

const ReadTransaction = async (id_usuario: number, id_transacao: number): Promise<Transaction | null> => {
  const query = `
  SELECT * 
  FROM user_transactions 
  WHERE user_id = $1
  AND transaction_id = $2 
  `
  const { rows } = await pool.query(query, [id_usuario, id_transacao]);

  if (rows.length === 0) return null;

  return {
    ...rows[0],
    valor: parseFloat(rows[0].valor)
  };
}

const UpdateTransaction = async (id_usuario: number, id_transacao: number, fields: UpdateTransactionData): Promise<void> => {
  const keys = Object.keys(fields);
  if (keys.length === 0) {
    throw new Error('Nenhum campo para atualizar');
  }
  const values = Object.values(fields);
  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
  const params = [...values, id_usuario, id_transacao]
  const query = `
    UPDATE transacoes AS t
    SET ${setClause}, updated_at = NOW()
    FROM contasBancarias AS cb
    WHERE t.id_contabancaria = cb.id
    AND cb.id_usuario = $${keys.length + 1}
    AND t.id = $${keys.length + 2}
    `;
  await pool.query(query, params)
}

const DeleteTransaction = async (id_usuario: number, id_transacao: number): Promise<void> => {
  const query = `
    DELETE FROM transacoes AS t
    USING contasBancarias AS c 
    WHERE t.id_contabancaria = c.id
    AND c.id_usuario = $1
    AND t.id = $2
    `;
  await pool.query(query, [id_usuario, id_transacao])
}

const ListTransactions = async (userId: number, queryParams: PaginationQueryParams): Promise<PaginatedTransaction | null> => {
  const { tipo, natureza, limit, offset, orderBy, orderDirection, categoria, data_transacao, valor_maior_que, valor_menor_que, page } = queryParams;
  let orderParam = orderBy;
  if (orderBy === 'valor') {
    orderParam = 'ABS(valor)';
  }
  const data = data_transacao ? `${data_transacao} days` : null;
  const query = `
    SELECT 
      transaction_id as id,
      conta as id_contabancaria,
      nome_transacao,
      categoria,
      subcategoria,
      valor,
      data_transacao, 
      tipo, 
      natureza,
      recorrente, 
      frequencia_recorrencia, 
      proxima_ocorrencia,
      (COUNT(*) OVER())::int as total_count
    FROM user_transactions 
    WHERE user_id = $1
      AND ($2::text IS NULL OR tipo = $2::text)
      AND ($3::text IS NULL OR natureza = $3::text)
      AND ($4::text IS NULL OR categoria = $4::text)
      AND ($5::text IS NULL OR data_transacao >= CURRENT_DATE - $5::interval)
      AND ($6::numeric IS NULL OR ABS(valor) >= $6::numeric)
      AND ($7::numeric IS NULL OR ABS(valor) <= $7::numeric)
    ORDER BY ${orderParam} ${orderDirection}, transaction_id ASC
    LIMIT $8
    OFFSET $9
  `;

  const { rows, rowCount } = await pool.query(query, [
    userId,
    tipo,
    natureza,
    categoria,
    data,
    valor_maior_que,
    valor_menor_que,
    limit,
    offset
  ]);

  if (rowCount === 0) return null

  const total_count = rows[0].total_count
  const transactionData = rows.map(({ total_count, ...rest }) => rest);

  return {
    data: transactionData,
    meta: {
      total: total_count,
      page: page,
      limit: limit,
      hasNextPage: (offset || 0) + limit < total_count,
    },
  };
};

const GroupTransactionsByType = async (id_usuario: number): Promise<GroupedByType[] | null> => {
  const query = `
    SELECT 
    COALESCE(tipo, 'Total') AS tipo,
    COALESCE(natureza, 'Total') AS natureza,
    COUNT(*) AS ocorrencias,
    SUM(valor) AS valor
    FROM user_transactions
    WHERE user_id = $1
    AND tipo IN ('receita', 'despesa')
    GROUP BY GROUPING SETS (
    (tipo, natureza), 
    (tipo),            
    ()                 
    )`;
  const { rows, rowCount } = await pool.query(query, [id_usuario]);
  if (rowCount === 0) return null

  const data = rows.map(row => ({
    tipo: row.tipo,
    natureza: row.natureza,
    ocorrencias: Number(row.ocorrencias),
    valor: Math.abs(formatCurrency(row.valor))
  }));

  return data;
}

const GroupTransactionsByCategories = async (userId: number, first_date: Date, last_date: Date): Promise<GroupedCategories[] | null> => {
  const query = `
    SELECT 
    categoria, 
    COUNT(*)::int AS ocorrencias, 
    SUM(ABS(valor)) AS total
    FROM user_transactions
    WHERE user_id = $1
    AND tipo = 'despesa'
    AND categoria IN ('Lazer', 'Transporte', 'Educação', 'Alimentação', 'Internet', 'Contas', 'Compras', 'Outros', 'Saúde')
    AND DATE(data_transacao) BETWEEN $2 AND $3
    GROUP BY categoria
`;
  const { rows, rowCount } = await pool.query(query, [userId, first_date, last_date]);
  if (rowCount === 0) return null
  return rows;
}

const transactionSummary = async (first_day: Date, last_day: Date, interval: string, userId: number) => {
  const query = `
WITH periodo AS (
  SELECT 
    generate_series(
      $1, 
      $2, 
      ('1 ' || $3)::interval
    ) AS date_interval
  ),
periodo_numerado AS (
  SELECT date_interval, ROW_NUMBER() OVER () AS periodo_num FROM periodo
),
tipos(tipo) AS (
  VALUES ('receita'), ('despesa')
)
SELECT 
  p.date_interval AS date_interval,
  p.periodo_num AS name_interval,
  t.tipo,
  COUNT(ut.user_id)::int AS ocorrencias,
  ABS(COALESCE(SUM(ut.valor), 0))::int AS valor
FROM periodo_numerado p
CROSS JOIN tipos t
LEFT JOIN user_transactions ut 
  ON ut.data_transacao >= p.date_interval
  AND ut.data_transacao < p.date_interval + ('1 ' || $3)::interval
  AND ut.user_id = $4
  AND ut.tipo = t.tipo
  AND ut.data_transacao BETWEEN $1 AND $2
GROUP BY p.periodo_num, p.date_interval, t.tipo
ORDER BY p.periodo_num, t.tipo
`;
  const { rows } = await pool.query(query, [first_day, last_day, interval, userId]);
  return rows
}

const transactionSummaryTotal = async (first_day: Date, last_day: Date, userId: number): Promise<TransacaoMensalResult> => {
  const query = `
  WITH periodo AS (
  SELECT 
    generate_series(
      date_trunc('month'::text, $1::date), 
      date_trunc('month'::text, $2::date), 
    ('1 ' || 'month')::interval
    ) AS date_interval
  ),
  periodo_numerado AS (
    SELECT date_interval, ROW_NUMBER() OVER () AS periodo_num FROM periodo
  ),
  tipos(tipo) AS (
    VALUES ('receita'), ('despesa')
  )
  SELECT 
    TO_CHAR(p.date_interval, 'mon') AS date_interval,
    t.tipo,
    COALESCE(SUM(ut.valor), 0) AS valor
  FROM periodo_numerado p
  CROSS JOIN tipos t
  LEFT JOIN user_transactions ut 
    ON DATE_TRUNC('month'::text, ut.data_transacao) = p.date_interval
    AND ut.user_id = $3
    AND ut.tipo = t.tipo
  GROUP BY p.periodo_num, p.date_interval, t.tipo
  ORDER BY p.periodo_num, t.tipo
  `;
  const { rows, rowCount } = await pool.query<TransacaoMensal>(query, [first_day, last_day, userId]);

  return { rows, total: rowCount || 0 };
}

export {
  checkValidAccount,
  CreateTransaction,
  CreateManyTransactions,
  ReadTransaction,
  UpdateTransaction,
  DeleteTransaction,
  ListTransactions,
  GroupTransactionsByType,
  GroupTransactionsByCategories,
  transactionSummary,
  transactionSummaryTotal
};