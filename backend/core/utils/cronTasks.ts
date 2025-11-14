import 'dotenv/config';
import cron from 'node-cron';
import pool from '@core/config/db.ts'
import { format } from 'date-fns';
import { getAllActiveService } from '@features/budgets/budgetServices.ts'
import { promptReport } from '@features/OCR/openaiService.ts'
import logger from './loggerCronJob.ts';

async function processarTransacoesRecorrentes() {
    try {
        const hoje = format(new Date(), 'yyyy/MM/dd HH:mm:ss');
        const query = `
    SELECT * FROM transacoes
    WHERE recorrente = true AND proxima_ocorrencia <= $1
  `;
        const { rows } = await pool.query(query, [hoje]);

        for (const transacoes of rows) {
            const {
                id,
                id_contabancaria,
                categoria,
                tipo,
                valor,
                frequencia_recorrencia,
                natureza,
                proxima_ocorrencia,
            } = transacoes;

            const novaData = new Date();

            await pool.query(
                `INSERT INTO transacoes 
                (id_contabancaria, valor, categoria, tipo, data_transacao, natureza)
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [id_contabancaria, valor, categoria, tipo, novaData, natureza]
            );

            let proxima = new Date(proxima_ocorrencia);
            switch (frequencia_recorrencia) {
                case 'Diario': proxima.setDate(proxima.getDate() + 1); break;
                case 'Semanal': proxima.setDate(proxima.getDate() + 7); break;
                case 'Quinzenal': proxima.setDate(proxima.getDate() + 14); break;
                case 'Mensal': proxima.setMonth(proxima.getMonth() + 1); break;
                case 'Bimestral': proxima.setMonth(proxima.getMonth() + 2); break;
                case 'Trimestral': proxima.setMonth(proxima.getMonth() + 3); break;
                case 'Quadrimestral': proxima.setMonth(proxima.getMonth() + 4); break;
                case 'Semestral': proxima.setMonth(proxima.getMonth() + 6); break;
                case 'Anual': proxima.setFullYear(proxima.getFullYear() + 1); break;
            }

            await pool.query(
                `UPDATE transacoes SET proxima_ocorrencia = $1 WHERE id = $2`,
                [proxima, id]
            );
            console.log(`Transação recorrente processada para conta ${id_contabancaria}. Próxima em ${proxima.toISOString().slice(0, 10)}`);
            logger.info(`Transação recorrente processada para conta ${id_contabancaria}. Próxima em ${proxima.toISOString().slice(0, 10)}`)
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Erro inesperado ao criar transação recorrente: ", error.message)
            logger.error(`Erro inesperado ao criar transação recorrente: ${error.message}`)
        }
    }
}

async function processarMetasVencimento() {
    try {
        const hoje = format(new Date(), 'yyyy/MM/dd HH:mm:ss');
        const query = `
    SELECT * FROM metas
    WHERE status_meta = 'ativa' AND deadline <= $1
  `;
        const { rows } = await pool.query(query, [hoje]);
        for (const metas of rows) {
            const {
                id,
                id_usuario
            } = metas
            await pool.query(
                `UPDATE metas
                SET status_meta = 'concluida', data_concluida = $1
                WHERE id = $2`,
                [hoje, id]
            );
            console.log(`Meta de id ${id} do usuario ${id_usuario} expirou. Marcando como expirada`);
            logger.info(`Meta de id ${id} do usuario ${id_usuario} expirou. Marcando como expirada`)
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Erro inesperado ao expirar meta: ", error.message)
            logger.error(`Erro inesperado ao expirar meta: ${error.message}`)
        }
    }
}

async function processarOrcamentoVencimento() {
    try {
        const hoje = new Date();
        const budget = await getAllActiveService()
        for (const planejamento of budget) {
            const { id, id_usuario, data_inicio, data_termino } = planejamento
            if (data_termino < hoje) {
                await pool.query(
                    `UPDATE planejamento
                SET ativo = false
                WHERE data_termino < $1
                AND id = $2`,
                    [hoje, id]
                );
                console.log(`Orçamento de id ${id} do usuario ${id_usuario} venceu. Marcando como expirado`);
                logger.info(`Orçamento de id ${id} do usuario ${id_usuario} venceu. Marcando como expirado`)
                const prompt = { ...planejamento };
                const openAIresponse = await promptReport(prompt)
                await pool.query(
                    `INSERT INTO relatorios 
            (id_usuario, periodo_inicio, periodo_fim, limite_total, limite_categorias, quantia_gasta, quantia_gasta_categorias, status, analise_textual, recomendacoes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                    [
                        openAIresponse.id_usuario,
                        openAIresponse.periodo_inicio,
                        openAIresponse.periodo_fim,
                        openAIresponse.limite_total,
                        openAIresponse.limites_categorias,
                        openAIresponse.quantia_gasta,
                        openAIresponse.quantia_gasta_categorias,
                        openAIresponse.status,
                        openAIresponse.analise_textual,
                        openAIresponse.recomendacoes
                    ]
                )
                logger.info(`Criando relatório financeiro pro usuario de ID ${id_usuario} pro periodo de ${data_inicio} até ${data_termino}`);
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Erro inesperado: ", error.message)
            logger.error(`Erro inesperado ao gerar relatório: ${error.message}`)
        }
    }
}

function iniciarCron() {
    cron.schedule('0 0 * * *', async () => {
        console.log(`[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] Verificando transações recorrentes...`);
        console.log(`[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] Verificando metas expiradas...`);
        console.log(`[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] Verificando orçamento vencidos...`);
        logger.info('Verificando transações recorrentes...')
        logger.info('Verificando metas expiradas...')
        logger.info('Verificando orçamento vencidos...')
        await Promise.all([
            processarTransacoesRecorrentes(),
            processarMetasVencimento(),
            processarOrcamentoVencimento()
        ]);
    });
}

export { iniciarCron }
