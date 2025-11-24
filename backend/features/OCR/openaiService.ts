import { getAllActiveService } from '../budgets/budgetServices.ts'

type ReportAnalysis = {
    id: number;
    id_usuario: number;
    periodo_inicio: Date;
    periodo_fim: Date;
    limite_total: number;
    limites_categorias?: Array<{ category: string; value: number }>;
    quantia_gasta: number;
    quantia_gasta_categorias?: Array<{ category: string; value: number }>;
    status: 'DENTRO_DO_ORCAMENTO' | 'LIMITE_ATINGIDO' | 'LIMITE_EXCEDIDO';
    analise_textual: string;
    recomendacoes: string;
};
const promptOCR = async (prompt: string) => {
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
  "subcategoria": 
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
Se houver mais de uma data no texto, priorize:
- A que estiver associada a palavras como “vencimento”, “pagamento” ou “total a pagar” (sempre ponha as horas a partir das 10).
- Se nenhuma estiver claramente associada, escolha a data mais próxima do valor em reais no texto.
Agora, analise o texto abaixo e faça a extração conforme solicitado:
                            `
                },
                { role: 'user', content: `Prompt: ${prompt}` }
            ],
            max_tokens: 1000,
        }),
    });

    const structuredData = await structuredResponse.json();
    const rawResponse = structuredData.choices[0].message.content;
    const cleanedResponse = rawResponse.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedResponse);
}

const promptReport = async (prompt: promptObject) => {
    const date = new Date().toLocaleDateString('pt-BR');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
                    content: `Você é um assistente financeiro que analisa orçamentos.
Data atual: ${date}

Sua tarefa é analisar os dados financeiros fornecidos e:
1. Determinar o status do orçamento comparando quantia_gasta com limite
2. Fornecer uma análise detalhada falando DIRETAMENTE com o usuário (use "você")
3. Dar recomendações personalizadas

Considere também os limites e gastos por categoria na sua análise.`
                },
                {
                    role: 'user',
                    content: `Analise minha situação financeira:\n${JSON.stringify(prompt, null, 2)}`
                }
            ],
            tools: [
                {
                    type: 'function',
                    function: {
                        name: 'gerar_relatorio_financeiro',
                        description: 'Gera um relatório financeiro com status, análise e recomendações',
                        parameters: {
                            type: 'object',
                            properties: {
                                status: {
                                    type: 'string',
                                    enum: ['DENTRO_DO_ORCAMENTO', 'LIMITE_ATINGIDO', 'LIMITE_EXCEDIDO'],
                                    description: 'Status do orçamento baseado na comparação entre quantia_gasta e limite'
                                },
                                analise_textual: {
                                    type: 'string',
                                    description: 'Análise detalhada da situação financeira, falando diretamente com o usuário (use "você"). Mencione categorias específicas se relevante.'
                                },
                                recomendacoes: {
                                    type: 'string',
                                    description: 'Recomendações financeiras personalizadas, falando diretamente com o usuário (use "você"). Inclua sugestões específicas por categoria se necessário.'
                                }
                            },
                            required: ['status', 'analise_textual', 'recomendacoes'],
                            additionalProperties: false
                        }
                    }
                }
            ],
            tool_choice: {
                type: 'function',
                function: { name: 'gerar_relatorio_financeiro' }
            }
        }),
    });

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
        throw new Error('Modelo não retornou function call');
    }
    const { status, analise_textual, recomendacoes } = JSON.parse(toolCall.function.arguments);
    return {
        id: prompt.id,
        id_usuario: prompt.id_usuario,
        periodo_inicio: prompt.data_inicio,
        periodo_fim: prompt.data_termino,
        limite_total: prompt.limite,
        limites_categorias: prompt.limites_categorias,
        quantia_gasta: prompt.quantia_gasta,
        quantia_gasta_categorias: prompt.quantia_gasta_categorias,
        status,
        analise_textual,
        recomendacoes
    };
}

export { promptOCR, promptReport }