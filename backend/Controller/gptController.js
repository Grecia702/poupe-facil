const fetch = require('node-fetch');
const transactionModel = require('../models/transactionModel');

const promptBasic = async (req, res) => {
    const { prompt } = req.body;
    const { userId } = req.user.decoded;
    const date = new Date();

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
                        content: `A data de hoje é ${date}, você é um assistente financeiro que retorna SOMENTE JSON válido
                        se o prompt pedir resumo de transações ou perguntar quanto ele gastou no periodo de tempo que ele citar no formato:
                        {
                            "command": "transactionSummary",
                            "first_day": "YYYY-MM-DD",
                            "last_day": "YYYY-MM-DD",
                            "period": "day|week|month"
                        }
                        Se ele pedir pra criar varias transações, ou informar quanto e com o que ele gastou em certas datas, responda no formato 
                        {    
                            "command": "createMany",
                            "transactions": [
                                {
                                    "id_contabancaria": 19,
                                    "categoria": "('Lazer', 'Carro', 'Educação', 'Alimentação', 'Internet', 'Contas', 'Compras', 'Saúde','Outros')",
                                    "tipo": "despesa|receita",
                                    "valor": valor,
                                    "data_transacao" "timestamp",
                                    "natureza": "Variavel|Fixa",
			                        "recorrente": false
                                },
                        }
                        importante o timestamp estar envolta de aspas
                        Caso ele não peça nenhum dos dois, responda exatamente {"command":"freeform"} sem mais nada.`
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 1000,
            }),
        });

        const structuredData = await structuredResponse.json();
        const jsonResponse = structuredData.choices[0].message.content;

        console.log(jsonResponse)

        let parsed;
        try {
            parsed = JSON.parse(jsonResponse);
        } catch {
            return res.status(400).json({ error: 'Resposta da IA não é JSON válido.' });
        }

        if (parsed.command === 'transactionSummary') {
            const { first_day, last_day, period } = parsed;

            const queryResult = await transactionModel.transactionSummary(first_day, last_day, period, userId);
            const queryCategories = await transactionModel.GroupTransactionsByCategories(userId, first_day, last_day)
            const formatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                            content: `A data atual é ${date} e você é um assistente financeiro de um aplicativo de controle de finanças. Abaixo está um JSON com resumo semanal (ou por período) de transações financeiras do usuário. Cada item possui:
                            - date_interval (data inicial do período, ISO 8601)
                            - name_interval (o numero da semana, 1 é a primeira semana do mês)
                            - tipo: "despesa" ou "receita"
                            - ocorrencias: quantidade de transações no período
                            - valor: valor total no período (string numérica)

                            No sendo json ele tem
                            - categoria
                            - total de vezes que houve gasto com essa categoria no periodo de tempo
                            - total em reais dos gastos com essa categoria

                            O primeiro JSON sempre contém pares despesa/receita para cada período, mesmo que zero.
                            Baseado nisso, faça as seguintes coisas:
                            Aponte todos os gastos que ele teve mas destaque o maior gasto
                            Aponte pelo menos 2 sugestões de melhoria para o controle de finanças do usuario.
                            Responda apenas com texto simples, sem JSON ou código.`
                        },
                        { role: 'user', content: JSON.stringify([queryResult.rows, queryCategories.rows]) }
                    ],
                    max_tokens: 400,
                }),
            });

            const formatData = await formatResponse.json();
            const friendlyMessage = formatData.choices[0].message.content;

            return res.json({
                command: parsed.command,
                filters: { first_day, last_day, period },
                rawData: queryResult.rows,
                message: friendlyMessage,
            });
        }


        if (parsed.command === 'createMany') {
            const { transactions } = parsed;
            const queryResult = await transactionModel.CreateManyTransactions(transactions, userId);
            const formatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                            content: `A data atual é ${date} e você é um assistente financeiro de um aplicativo de controle de finanças.
                            responda no formato "Transação adicionada\n📌 Categoria\nTipo\nValor(em localestring pra reais)\n\nData (padrão dd-MM-YYYY HH:mm)\n
                            `
                        },
                        { role: 'user', content: JSON.stringify([queryResult.rows]) }
                    ],
                    max_tokens: 400,
                }),
            });

            const formatData = await formatResponse.json();
            const friendlyMessage = formatData.choices[0].message.content;
            return res.json({
                command: parsed.command,
                rawData: queryResult.rows,
                message: friendlyMessage,
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
                            Você é um assistente financeiro. 
                            Nunca responda dúvidas fora de finanças. 
                            Se a pergunta estiver fora do escopo, responda apenas: "Não posso ajudar com isso. 
                            Pergunte algo sobre controle de finanças."
                            `
                        }, { role: 'user', content: prompt }

                    ],
                    max_tokens: 400,
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
