const fetch = require('node-fetch');
const transactionModel = require('../models/transactionModel');
const AccountModel = require('../models/accountModel');

const promptBasic = async (req, res) => {
    const { prompt, memory } = req.body;
    const { userId } = req.user.decoded;
    const date = new Date();
    const { result } = await AccountModel.listAccountsPrimary(userId)
    console.log(result)
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
                        content: `Você é um assistente financeiro que responde sempre com JSON válido para comandos claros.

Regras de comportamento:

1. Sempre que o usuário não especificar o nome da conta, você deve buscar na lista accounts a conta com "is_primary": true e usar seu id como id_contabancaria.

2. Se o usuário omitir a data_transacao, use a data atual no formato ISO 8601.

3. Se o usuário não informar o valor (valor) da transação, não crie transações e interprete a entrada como um comando livre (freeform), a menos que o contexto claramente indique um resumo.

4. Para criar várias transações, responda com:

{
  "command": "createMany",
  "transactions": [
    {
      "id_contabancaria": int,
      "nome_transacao": string,
      "categoria": "Lazer" | "Transporte" | "Educação" | "Alimentação" | "Internet" | "Contas" | "Compras" | "Saúde" | "Outros",
      "data_transacao": "timestamp ISO 8601",
      "tipo": "despesa" | "receita",
      "valor": decimal,
      "natureza": "Fixa" | "Variavel",
      "recorrente": boolean,
      "frequencia_recorrencia": string | null,
      "proxima_ocorrencia": "timestamp ISO 8601" | null,
      "budget_id": null
    }, ...
  ]
}

- Se a categoria for "Contas", defina natureza como "Fixa" e recorrente como true.
- Para todas as outras categorias, defina natureza como "Variavel" e recorrente como false.

5. Para pedidos de resumo de transações, responda com:

{
  "command": "transactionSummary",
  "first_day": "YYYY-MM-DD",
  "last_day": "YYYY-MM-DD",
  "period": "day" | "week" | "month"
}

6. Para perguntas, dúvidas, ou entradas que não sejam comandos claros para criação ou resumo de transações, responda apenas:

{
  "command": "freeform"
}

Importante:
- Nunca crie transações sem o valor.
- Se receber apenas palavras soltas ou frases ambíguas (ex: juros), responda com freeform.

A data atual para uso padrão é ${date}.

`
                    },
                    { role: 'user', content: `Prompt: ${prompt}\nAccounts: ${JSON.stringify(result, null, 2)}` }
                ],
                max_tokens: 1000,
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
                            responda no formato "Transação adicionada\nNome\n📌 Categoria\nValor(em localestring pra reais)\nTipo\nNatureza\n\nData (padrão dd-MM-YYYY HH:mm)\n
                            `
                        },
                        { role: 'user', content: JSON.stringify([queryResult.rows]) }
                    ],
                    max_tokens: 80,
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
