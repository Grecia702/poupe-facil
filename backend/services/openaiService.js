
const promptOCR = async (prompt) => {
    const data = new Date()
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
                    content: `Você vai receber um texto OCR de um comprovante de conta, que pode conter erros de leitura, palavras incompletas e ruídos. Sua tarefa é extrair todas as ocorrências de valores em reais (formato "R$XX,XX") e datas próximas a esses valores (formato DD/MM/AAAA ou similar).
Para cada valor extraído, gere um objeto JSON com:
{
  "nome_transacao": string,   // gere o nome com base na categoria, se não for possível identificar um nome específico, use "Pagamento"
  "data": timestamp ISO,                // ${data} formatada em timestamp iso se não tiver data informada
  "categoria": string,           // uma das categorias fixas abaixo, escolhida a partir do texto e pistas contextuais
  "valor": decimal
  "natureza": "Fixa" ou "Varíavel" // com base no tipo de categoria
  "recorrente": boolean // se for Fixa é true
  "frequencia_recorrencia": 'Diario', 'Semanal', 'Quinzenal','Mensal', 'Bimestral', 'Trimestral','Quadrimestral', 'Semestral', 'Anual'
  "proxima_ocorrencia": timestamp ISO ou NULL
}

Categorias possíveis e palavras-chave para inferência (priorize sempre que encontrar estas palavras):

- "Contas": energia, kWh (kilowatts por hora), consumo, luz, água, saneamento, abastecimento  
- "Internet": internet, Wi-Fi, banda larga, modem  
- "Alimentação": supermercado, mercado, alimentos, restaurante  
- "Saúde": farmácia, remédio, hospital  
- "Educação": escola, curso, faculdade  
- "Transporte": transporte, ônibus, metrô, gasolina  
- "Lazer": lazer, cinema, show, entretenimento  
- "Compras": loja, comércio  
- "Outros": se não for possível inferir
Se não conseguir identificar o nome da transação claramente no texto, coloque "Pagamento".
Para o campo "nome da transacao":
- Se a categoria for "Contas" e o texto indicar palavras relacionadas à energia ou "kWh", gere "Conta de Luz".
- Se a categoria for "Contas" e o texto indicar palavras relacionadas à água ou saneamento, gere "Conta de Água".
Se a data estiver próxima do valor (antes ou depois, até algumas linhas de distância), considere essa data para o campo "data". Caso contrário, use null.
Retorne uma lista JSON VALIDA com o objeto extraídos, e nadam ais que isso.
Gere apenas um json, se encontrar mais de dois valores em reais, some eles
Agora, analise o texto abaixo e faça a extração conforme solicitado:
                            `
                },
                { role: 'user', content: `Prompt: ${prompt}` }
            ],
            max_tokens: 1000,
        }),
    });

    const structuredData = await structuredResponse.json();
    // const jsonResponse = structuredData.choices[0].message.content;



    const rawResponse = structuredData.choices[0].message.content;
    // Remove bloco markdown se existir
    const cleanedResponse = rawResponse.replace(/```json|```/g, '').trim();
    console.log(cleanedResponse)
    return JSON.parse(cleanedResponse);
}

module.exports = { promptOCR }