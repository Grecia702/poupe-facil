import React, { createContext, useContext } from 'react';
import api from './axiosInstance';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '@context/authContext';

export const TransactionContext = createContext();

const createTransaction = async (transactionData) => {
    try {
        await api.post('/profile/transaction/', transactionData);
        return
    } catch (error) {
        throw error
    }
};

const updateTransaction = async ({ id, ...transactionData }) => {
    const res = await api.patch(`/profile/transaction/${id}`, transactionData);
    return res.data
};

const deleteTransaction = async (id) => {
    try {
        await api.delete(`/profile/transaction/${id}`);
        return
    } catch (error) {
        throw error
    }
};


export const TransactionProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const getInfinityTransaction = async ({ pageParam = 1, queryKey }) => {
        const [, filters] = queryKey;

        const response = await api.get('/profile/transaction', {
            params: {
                ...(filters.natureza && { natureza: filters.natureza }),
                tipo: filters.tipo,
                orderBy: filters.orderBy,
                orderDirection: filters.orderDirection,
                page: pageParam,
                limit: 15
            },
        });

        const { data, meta } = response.data;
        return { data, meta };
    };

    const useFilteredTransacoes = (filters = { orderBy: 'transaction_id', orderDirection: 'desc' }) => {
        return useInfiniteQuery({
            queryKey: ['transacoes_infinite', filters],
            queryFn: getInfinityTransaction,
            initialPageParam: 1,
            enabled: isAuthenticated,
            getNextPageParam: (lastPage) => {
                return lastPage?.meta?.hasNextPage ? lastPage?.meta?.page + 1 : undefined;
            },
        });
    };



    const createTransactionMutation = useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries(['transacoes_infinite']);
        },
    });

    const updateTransactionMutation = useMutation({
        mutationFn: updateTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries(['transacoes_infinite']);
        },
    });

    const deleteTransactionMutation = useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries(['transacoes_infinite']);
        },
    });

    return (
        <TransactionContext.Provider value={{
            useFilteredTransacoes,
            createTransactionMutation,
            updateTransactionMutation,
            deleteTransactionMutation,
        }}>
            {children}
        </TransactionContext.Provider>
    );
};


export const useTransactionAuth = () => {
    return useContext(TransactionContext)
};
