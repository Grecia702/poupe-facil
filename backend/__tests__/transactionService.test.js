
const {
    CreateTransactionService,
    ListTransactionsService,
    RemoveTransactionService,
    getTransactionByID,
    GroupTransactionService
} = require('../services/transactionService');

const transactionModel = require('../models/transactionModel');

jest.mock('../models/transactionModel', () => ({
    checkValidAccount: jest.fn(),
    CreateTransaction: jest.fn(),
    ListTransactions: jest.fn(),
    ReadTransaction: jest.fn(),
    DeleteTransaction: jest.fn(),
    countTransactionsResult: jest.fn(),
    GroupTransactionsByType: jest.fn()
}));

describe('CreateTransactionService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar uma transação válida', async () => {
        const mockDados = {
            id_contabancaria: 1,
            categoria: 'Salário',
            tipo: 'Receita',
            valor: 1000,
            data_transacao: new Date(),
            natureza: 'variavel',
        };
        const userId = 123;

        transactionModel.checkValidAccount.mockResolvedValue(true);

        await expect(CreateTransactionService(mockDados, userId)).resolves.toBeUndefined();

        expect(transactionModel.checkValidAccount).toHaveBeenCalledWith(1, 123);
        expect(transactionModel.CreateTransaction).toHaveBeenCalled();
    });

    it('deve lançar erro se algum campo obrigatório estiver faltando', async () => {
        const mockDados = {
            categoria: 'Aluguel',
            tipo: 'Despesa',
            valor: 1000,
            natureza: 'fixa',
        };
        const userId = 123;

        await expect(CreateTransactionService(mockDados, userId))
            .rejects
            .toThrow('Campos obrigatórios faltando: id_contabancaria, data_transacao');
    });

    it('deve lançar erro se a conta for inválida', async () => {
        const mockDados = {
            id_contabancaria: 1,
            categoria: 'Aluguel',
            tipo: 'Despesa',
            valor: 500,
            data_transacao: new Date(),
            natureza: 'variavel',
        };
        const userId = 123;

        transactionModel.checkValidAccount.mockResolvedValue(false);

        await expect(CreateTransactionService(mockDados, userId))
            .rejects
            .toThrow('Conta inválida');
    });
});


describe('ListTransactionsService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar as transações corretamente', async () => {
        const mockUserId = 123;
        const mockTransacoes = {
            data: undefined,
            meta: {
                total: undefined,
                page: 2,
                limit: 10,
                hasNextPage: false
            }
        };
        const mockLimit = 10;
        const mockPage = 2;
        const mockOffset = (mockPage - 1) * mockLimit;
        transactionModel.ListTransactions.mockResolvedValue(mockTransacoes);

        const result = await ListTransactionsService(mockUserId, mockPage, mockLimit);
        expect(transactionModel.ListTransactions).toHaveBeenCalledWith(mockUserId, mockLimit, mockOffset);
        expect(result).toEqual(mockTransacoes);
    });

    it('deve lançar um erro se ocorrer um problema ao listar as transações', async () => {
        const mockUserId = 123;
        const mockLimit = 10;
        const mockPage = 1;

        transactionModel.ListTransactions.mockResolvedValue({ rows: [] });
        transactionModel.countTransactionsResult.mockResolvedValue(0);

        await expect(ListTransactionsService(mockUserId, mockPage, mockLimit))
            .rejects
            .toThrow('Nenhuma transação encontrada');
    });
});

describe('GetTransactionByID', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve retornar a transação requisitada individualmente', async () => {
        const mockUserId = 123;
        const mockTransactionID = 1;
        const mockTransaction = {
            rows: [
                { id: 1, categoria: 'Salário', tipo: 'Receita', valor: 1000 },
            ],
        };
        transactionModel.ReadTransaction.mockResolvedValue(mockTransaction);
        const result = await getTransactionByID(mockUserId, mockTransactionID);
        expect(transactionModel.ReadTransaction).toHaveBeenCalledWith(mockUserId, mockTransactionID);
        expect(result).toEqual(mockTransaction.rows);
    })

    it('deve lançar um erro se a ID for invalida', async () => {
        const mockUserId = 123;
        const mockTransactionID = 1;
        transactionModel.ReadTransaction.mockRejectedValue(new Error('Erro ao listar transação'));

        await expect(getTransactionByID(mockUserId, mockTransactionID))
            .rejects
            .toThrow('Erro ao listar transação');
    });

    it('deve lançar erro se nenhuma transação for encontrada', async () => {
        const mockUserId = 123;
        const mockTransactionID = 999;
        transactionModel.ReadTransaction.mockResolvedValue({ rows: [] });

        await expect(getTransactionByID(mockUserId, mockTransactionID))
            .rejects
            .toThrow('Nenhuma transação com essa ID foi encontrada');
    });
})

describe('DeleteTransactionService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('deve deletar a transação se ela existir', async () => {
        const mockUserId = 1;
        const mockTransactionId = 10;
        const mockTransaction = {
            rows: [
                { id: 10, valor: 100, categoria: 'Exemplo' }
            ],
        };

        transactionModel.ReadTransaction.mockResolvedValue(mockTransaction);
        await RemoveTransactionService(mockUserId, mockTransactionId);

        expect(transactionModel.ReadTransaction).toHaveBeenCalledWith(mockUserId, mockTransactionId);
        expect(transactionModel.DeleteTransaction).toHaveBeenCalledWith(mockUserId, mockTransactionId);
    });

    it('deve lançar erro se a transação não for encontrada', async () => {
        const mockUserId = 1;
        const mockTransactionId = 999;

        transactionModel.ReadTransaction.mockResolvedValue({ rows: [] });

        await expect(
            RemoveTransactionService(mockUserId, mockTransactionId)
        ).rejects.toThrow('Nenhuma transação com essa ID foi encontrada');

        expect(transactionModel.DeleteTransaction).not.toHaveBeenCalled();
    });

    it('deve propagar erros do banco de dados', async () => {
        const mockUserId = 1;
        const mockTransactionId = 10;

        transactionModel.ReadTransaction.mockRejectedValue(new Error('Erro no banco'));

        await expect(
            RemoveTransactionService(mockUserId, mockTransactionId)
        ).rejects.toThrow('Erro no banco');
    });
})

describe('GroupTransactionsService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    it('Deve retornar o agrupamento de transações', async () => {
        const mockUserId = 123;
        const mockTransaction = {
            rows: [
                { tipo: 'Total', Natureza: 'Variavel', ocorrencias: 61, valor: 10000 },
                { tipo: 'Despesa', Natureza: 'Variavel', ocorrencias: 25, valor: 1000 },
                { tipo: 'Receita', Natureza: 'Variavel', ocorrencias: 36, valor: 1000 },
            ],
        };
        transactionModel.GroupTransactionsByType.mockResolvedValue(mockTransaction);
        const result = await GroupTransactionService(mockUserId);
        expect(transactionModel.GroupTransactionsByType).toHaveBeenCalledWith(mockUserId);
        expect(result).toEqual(mockTransaction.rows);
    })

})