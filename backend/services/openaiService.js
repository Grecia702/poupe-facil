
const promptOCR = async (prompt) => {
    console.log(prompt)
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
                            o texto recebido no PROMPT é um OCR de um comprovante de conta, me devolva em json:
                            {
                            nome da transacao
                            data: (timestamp iso)
                            categoria: "Lazer","Transporte","Educação","Alimentação","Internet","Contas","Compras","Saúde","Outros"
                            valor: "em R$"
                            }
                            `
                },
                { role: 'user', content: `Prompt: ${prompt}` }
            ],
            max_tokens: 1000,
        }),
    });

    const structuredData = await structuredResponse.json();
    const jsonResponse = structuredData.choices[0].message.content;
    return JSON.parse(jsonResponse)
}

module.exports = { promptOCR }