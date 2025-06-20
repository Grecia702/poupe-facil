const fetch = require('node-fetch');
const transactionModel = require('../models/transactionModel');
const AccountModel = require('../models/accountModel');
const budgetModel = require('../models/budgetModel')
const { format } = require('date-fns')
const { getActiveService } = require('../services/budgetServices')

const promptBasic = async (req, res) => {
    const { prompt, memory } = req.body;
    const { userId } = req.user.decoded;
    const date = new Date();
    const [accountData, budgetData] = await Promise.all([
        AccountModel.listAccountsPrimary(userId),
        getActiveService(userId),
    ]);
    const { result } = accountData;

    try {
        const structuredResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY_OPENAI}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `
Você é um assistente financeiro que responde sempre com JSON válido para comandos claros.
Regras de comportamento:
1. Sempre que o usuário não especificar o nome da conta, você deve buscar na lista accounts a conta com "is_primary": true e usar seu id como id_contabancaria.
2. Se o usuário omitir a data_transacao, use a data atual no formato ISO 8601.
3. Se o usuário não informar o valor (valor) da transação, não crie transações e interprete a entrada como um comando livre (freeform), a menos que o contexto claramente indique um resumo.
4. Se o usuario digitar algo como "ifood 15", ou "ifood 15 hoje" ou "gastei 15 com ifood", use o comando create
5. Para criar várias transações, responda com:

{
  "command": "create",
  "transactions": [
    {
      "id_contabancaria": int,
      "nome_transacao": apenas o nome que o usuario inseriu,
      "categoria": "categoria" deve ser estritamente UMA dessas opções exatas: "Lazer", "Transporte", "Educação", "Alimentação", "Contas", "Compras", "Saúde", "Outros". Nunca crie novas categorias nem sinônimos.
      "data_transacao": "timestamp ISO 8601",
      "tipo": "despesa" | "receita",
      "valor": decimal,
      "natureza": "Fixa" | "Variavel",
      "recorrente": boolean,
      "frequencia_recorrencia": string | null,
      "proxima_ocorrencia": "timestamp ISO 8601" | null,
      "budget_id": Budget_id || null
    }, ...
  ]
}
- Se a categoria for "Contas", defina natureza como "Fixa" e recorrente como true.
- Para todas as outras categorias, defina natureza como "Variavel" e recorrente como false.
- Se o tipo for "despesa", transforme o valor em negativo
5. Para pedidos de resumo de transações ou para verificar últimos gastos, responda com:
{
  "command": "transactionSummary",
  "first_period": {
    "first_day": "YYYY-MM-DD",
    "last_day": "YYYY-MM-DD"
  },
  "second_period": {
    "first_day": "YYYY-MM-DD",
    "last_day": "YYYY-MM-DD"
  },
  "period": periodo inserido pelo usuario (Ontem, Hoje, Essa semana, Ultima Semana etc...)
}
Para períodos de 1 dia (hoje, ontem):
first_period: dia solicitado
second_period: mesmo dia da semana anterior (7 dias antes)
Para períodos de 1 semana (última semana, semana passada):
first_period: semana solicitada
second_period: semana anterior à solicitada (semana retrasada)
Para períodos de 1 mês (último mês, mês passado):
first_period: mês solicitado
second_period: mês anterior ao solicitado (mês retrasado)
6. Para perguntas, dúvidas, ou entradas que não sejam comandos claros para criação ou resumo de transações, responda apenas:
{
  "command": "freeform"
}
Importante:
- Nunca crie transações sem o valor.
- Se receber apenas palavras soltas ou frases ambíguas, responda com freeform.
A data atual para uso padrão é ${date}.
`
                    },
                    { role: 'user', content: `Prompt: ${prompt}\nAccounts: ${JSON.stringify(result, null, 2)}\n Budget_id: ${budgetData?.id ?? null}` }

                ],
                max_tokens: 1200,
            }),
        });

        const structuredData = await structuredResponse.json();
        const jsonResponse = structuredData.choices[0].message.content;
        let parsed;
        try {
            parsed = JSON.parse(jsonResponse);
        } catch {
            return res.status(400).json({ error: 'Resposta da IA não é JSON válido.' });
        }

        if (parsed.command === 'create') {
            const { transactions } = parsed;
            console.log(transactions)
            const queryResult = await transactionModel.CreateManyTransactions(transactions, userId);
            const limite = budgetData?.limite ?? 0;
            const quantia_gasta = budgetData?.quantia_gasta ?? 0;

            const valorTransacoes = queryResult.rows.reduce(
                (acc, row) => acc + parseFloat(row.valor) || 0,
                0
            );

            const valorRestante = limite - (quantia_gasta + valorTransacoes);

            const valorRestanteFormatado = valorRestante.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            const createdMessage = queryResult.rows
                .map((row) => {
                    const valor = parseFloat(row.valor).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });
                    const dataFormatada = format(new Date(row.data_transacao), 'dd/MM/yyyy');

                    return `
📌 ${row.categoria}
Nome: ${row.nome_transacao}
Valor: ${valor}
Tipo: ${row.tipo}
Natureza: ${row.natureza}
Data: ${dataFormatada}
`.trim();
                })
                .join('\n\n-------------------\n\n');

            let baseContent = `${queryResult.rows.length > 1 ? 'Transações adicionadas' : 'Transação adicionada'}:\n\n${createdMessage}`;

            if (budgetData && budgetData.id !== undefined) {
                baseContent += `\n\n💰 Valor restante no orçamento:\n       ${valorRestanteFormatado}`;
            }

            console.log(baseContent)

            return res.json({
                command: parsed.command,
                rawData: queryResult.rows,
                message: baseContent,
            });
        }

        if (parsed.command === 'transactionSummary') {
            const {
                period,
                first_period: { first_day: firstStart, last_day: firstEnd },
                second_period: { first_day: secondStart, last_day: secondEnd },
            } = parsed;
            const [queryCategories, queryCategoriesLastPeriod] = await Promise.all([
                transactionModel.GroupTransactionsByCategories(userId, firstStart, firstEnd),
                transactionModel.GroupTransactionsByCategories(userId, secondStart, secondEnd)
            ]);
            const currentRows = queryCategories.rows;
            const previousRows = queryCategoriesLastPeriod.rows;

            if (currentRows.length === 0) {
                return res.json({
                    command: parsed.command,
                    first_period: [],
                    second_period: previousRows,
                    message: `Nenhuma transação encontrada neste período.`
                });
            }


            const previousMap = previousRows.reduce((acc, row) => {
                acc[row.categoria] = row;
                return acc;
            }, {});

            const comparisonLines = currentRows.map(row => {
                const prev = previousMap[row.categoria];
                const prevTotal = prev ? Number(prev.total) : 0;
                const currentTotal = Number(row.total);

                let variationText = 'sem dados';

                if (prevTotal > 0) {
                    const variation = ((currentTotal - prevTotal) / prevTotal) * 100;
                    if (variation > 0) {
                        variationText = `📈 Aumento de +${variation.toFixed(2)}%`;
                    } else if (variation < 0) {
                        variationText = `📉 Redução de ${variation.toFixed(2)}%`;
                    } else {
                        variationText = `sem variação`;
                    }
                } else if (prevTotal === 0 && currentTotal > 0) {
                    variationText = `Novo gasto registrado (+100.00%)`;
                }

                return `${row.categoria}: R$ ${currentTotal.toFixed(2)} (${row.ocorrencias} ${row.ocorrencias > 1 ? 'transações' : 'transação'})\n${variationText}\n----------------\n`;
            });

            const friendlyMessage = `Gastos de "${period}" (${format(new Date(firstStart + 'T00:00:00'), 'dd/MM')}${firstStart !== firstEnd ? ` - ${format(new Date(firstEnd + 'T00:00:00'), 'dd/MM')}` : ''})
VS. período anterior (${format(new Date(secondStart + 'T00:00:00'), 'dd/MM')}${secondStart !== secondEnd ? ` - ${format(new Date(secondEnd + 'T00:00:00'), 'dd/MM')}` : ''}):\n\n${comparisonLines.join('')}`.trim();

            const sortedCurrent = [...currentRows].sort((a, b) => Number(b.total) - Number(a.total));
            const maiorGasto = sortedCurrent[0];
            const destaqueMessage = `
Destaque do maior gasto:
- ${maiorGasto.categoria}: R$ ${Number(maiorGasto.total).toFixed(2)} (${maiorGasto.ocorrencias}x)
`.trim();

            return res.json({
                command: parsed.command,
                first_period: queryCategories.rows,
                second_period: queryCategoriesLastPeriod.rows,
                message: `${friendlyMessage}\n\n${destaqueMessage}`,
            });
        }

        if (parsed.command === 'freeform') {
            const freeformResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.API_KEY_OPENAI}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `
                            Responda as dúvidas do usuario, mas que tenham a ver com economias, finanças, gerenciamento financeiro pessoal e tópicos parecidos.  
                            `
                        }, { role: 'user', content: `Prompt: ${prompt}\nUltimas Mensagens:\n${memory}` }
                    ],
                    max_tokens: 500,
                }),
            });

            const freeformData = await freeformResponse.json();
            const aiMessage = freeformData.choices[0].message.content;

            return res.json({
                message: aiMessage
            });
        }

        return res.status(400).json({ error: 'Comando não reconhecido.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao consultar OpenAI ou ao executar comando.' });
    }
};

module.exports = { promptBasic };
