import OpenAI from 'openai'
import { listAccountsPrimary } from '../account/accountModel.ts';
import { getActiveService } from '../budgets/budgetServices.ts'
import type { Request, Response, NextFunction } from 'express';
import type { ChatCompletionMessageFunctionToolCall } from 'openai/resources/index.d.ts';
import { prompts } from './chatbotServices.ts';
import * as chatbotServices from './chatbotServices.ts'

const promptBasic = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { prompt, memory } = req.body;
        const { userId } = req.user;
        const [accountData, budgetData] = await Promise.all([
            listAccountsPrimary(userId),
            getActiveService(userId),
        ]);
        const client = new OpenAI({ apiKey: process.env.API_KEY_OPENAI });
        const structuredResponse = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'user', content: `Prompt: ${prompt}` }
            ],
            tools: prompts(memory),
            max_tokens: 1000,
            tool_choice: 'auto'
        });
        if (!structuredResponse.choices[0]?.message.tool_calls) return res.status(500).json({ error: 'Erro ao consultar OpenAI ou ao executar comando.' });
        const call = structuredResponse.choices[0].message.tool_calls?.[0] as ChatCompletionMessageFunctionToolCall;
        let args;
        try {
            args = JSON.parse(call.function.arguments);
        } catch {
            return res.status(400).json({ error: 'Argumentos da função inválidos' });
        }

        if (call && call?.function?.name === 'createManyTransactions') {
            console.log(call)
            const functionCall = await chatbotServices.createManyTransactions(accountData, budgetData, args)
            return res.status(200).json({
                command: functionCall.command,
                rawData: functionCall.rawData,
                message: functionCall.message,
            });
        }
        if (call && call?.function?.name === 'transactionSummary') {
            const functionCall = await chatbotServices.transactionsOverview(args, userId)
            return res.status(200).json({
                command: functionCall.command,
                current_period: functionCall.current_period,
                previous_rows: functionCall.previous_rows,
                message: functionCall.message,
            });
        }
        if (call?.function?.name === 'freeform') {
            console.log(call)
            return res.status(200).json({
                command: 'freeform',
                message: call.function.arguments,
            });
        }
    } catch (error) {
        next(error)
    }
};

export { promptBasic };
