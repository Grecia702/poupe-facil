import api from '../context/axiosInstance';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '@context/authContext';
import { CreateTransaction, Transaction, UpdateTransaction } from '@shared/types/transaction';
import { ApiSuccess } from '@shared/types/ApiResponse';

interface UpdateTransactionProps {
    id: number;
    transactionData: UpdateTransaction
}

const createTransaction = async (transactionData: CreateTransaction) => {
    try {
        await api.post('/profile/transaction/', transactionData);
        return
    } catch (error) {
        throw error
    }
};

const updateTransaction = async ({ id, ...transactionData }: UpdateTransactionProps) => {
    await api.patch(`/profile/transaction/${id}`, transactionData);
    return
};

const deleteTransaction = async (id: number) => {
    try {
        await api.delete(`/profile/transaction/${id}`);
        return
    } catch (error) {
        throw error
    }
};


export const useTransaction = () => {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const getInfinityTransaction = async ({ pageParam = 1, queryKey }) => {
        const [, filters = {}] = queryKey;

        const response = await api.get<ApiSuccess<Transaction[]>>('/profile/transaction', {
            params: {
                ...(filters.natureza && { natureza: filters.natureza }),
                ...(filters.categoria && { categoria: filters.categoria }),
                ...(filters.data_transacao && { data_transacao: filters.data_transacao }),
                ...(filters.valor_menor_que && { valor_menor_que: filters.valor_menor_que }),
                ...(filters.valor_maior_que && { valor_maior_que: filters.valor_maior_que }),
                tipo: filters.tipo,
                orderBy: filters.orderBy,
                orderDirection: filters.orderDirection,
                page: pageParam,
                limit: 10
            },
        });

        const { data, meta } = response.data;
        return { data, meta };
    };


    const useFilteredTransactions = (filters = {}) => {
        return useInfiniteQuery({
            queryKey: ['transacoes_infinite', filters],
            queryFn: ({ pageParam = 1, queryKey }) => getInfinityTransaction({ pageParam, queryKey }),
            initialPageParam: 1,
            enabled: isAuthenticated,
            getNextPageParam: (lastPage) => lastPage?.meta?.hasNextPage ? lastPage?.meta?.page + 1 : undefined,
        });
    };

    const invalidateQueries = () => {
        queryClient.invalidateQueries({ queryKey: ['budget_id'] });
        queryClient.invalidateQueries({ queryKey: ['transacoes_infinite'] });
        queryClient.invalidateQueries({ queryKey: ['categories_posts'] });

    }

    const createTransactionMutation = useMutation({
        mutationFn: createTransaction,
        onSuccess: invalidateQueries
    });

    const updateTransactionMutation = useMutation({
        mutationFn: updateTransaction,
        onSuccess: invalidateQueries
    });

    const deleteTransactionMutation = useMutation({
        mutationFn: deleteTransaction,
        onSuccess: invalidateQueries
    });

    return {
        useFilteredTransactions,
        createTransactionMutation,
        updateTransactionMutation,
        deleteTransactionMutation,
    };
};



