import React, { createContext, useContext } from 'react';
import api from './axiosInstance';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '@context/authContext';

export const TransactionContext = createContext();


const PAGE_SIZE = 12;

const getTransacoes = async ({ pageParams = 1 }) => {
    try {
        console.log('Iniciando requisição para transações...');
        const { data } = await api.get(`/profile/transaction?page=${pageParams}&limit=${PAGE_SIZE}`);
        // console.log(data)
        return data;
    } catch (error) {
        // console.log('Erro ao fazer a requisição:', error);
        throw error;
    }
};

const getTransactionSummary = async (period) => {
    try {
        const response = await api.get(`/profile/transaction/summary?period${period}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getCategoriesTransactions = async () => {
    try {
        const response = await api.get(`/profile/transaction/categories`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createTransaction = async (transactionData) => {
    try {
        await api.post('/profile/transaction/', transactionData);
        return
    } catch (error) {
        throw error
    }
};

const deleteTransaction = async (id) => {
    try {
        await api.delete(`/profile/transaction/${id}`);
        return
    } catch (error) {
        throw error
    }
};


export const useTransacoes = () =>
    useInfiniteQuery({
        queryKey: ['transacoes'],
        queryFn: getTransacoes,
        getNextPageParam: ({ meta }) =>
            meta.hasNextPage ? meta.page + 1 : undefined,
    });

export const TransactionProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const { data: response, isLoading, error, refetch } = useQuery({
        queryKey: ['transaction_id'],
        queryFn: getTransacoes,
        enabled: isAuthenticated,
        onSuccess: (response) => {
            console.log('Dados:', response.data);
            console.log('Meta:', response.meta);
        },
        onError: (error) => {
            console.log('Erro na query:', error);
        }
    });

    const { data: dadosAgrupados, isLoading: dadosAgrupadosLoading } = useQuery({
        queryKey: ['transaction_grouped'],
        queryFn: getTransactionSummary,
        enabled: isAuthenticated,
        onSuccess: (response) => {
            console.log('Dados agrupados no onSuccess:', response.data);
        },
        onError: (error) => {
            console.log('Erro na requisição de dados agrupados:', error);
        }
    });

    const { data: dadosCategorias } = useQuery({
        queryKey: ['transaction_categories'],
        queryFn: getCategoriesTransactions,
        enabled: isAuthenticated,
        onSuccess: (response) => {
            console.log('Dados agrupados no onSuccess:', response.data);
        },
        onError: (error) => {
            console.log('Erro na requisição de dados agrupados:', error);
        }
    });

    const { data: dadosAPI, meta } = response || { data: [], meta: {} };

    const {
        data: infiniteData,
        isLoading: isLoadingInfinite,
        isError: isErrorInfinite,
        error: infiniteError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['transacoes_infinite'],
        queryFn: getTransacoes,
        initialPageParam: 1,
        enabled: isAuthenticated,
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.currentPage < lastPage.meta.totalPages) {
                return lastPage.meta.currentPage + 1;
            }
            return undefined;
        },
    });

    const createTransactionMutation = useMutation({
        mutationFn: createTransaction,
    });

    const deleteTransactionMutation = useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries(['id']);
        },
    });

    const allTransactions = infiniteData?.pages.flatMap(page => page.data) || [];


    return (
        <TransactionContext.Provider value={{
            dadosAPI, meta, isLoading, error, refetch,
            createTransactionMutation,
            deleteTransactionMutation,
            dadosAgrupados,
            dadosAgrupadosLoading,
            dadosCategorias,
            infiniteTransactions: allTransactions,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isLoadingInfinite,
        }}>
            {children}
        </TransactionContext.Provider>
    );
};


export const useTransactionAuth = () => {
    return useContext(TransactionContext)
};
