import React, { createContext, useContext } from 'react';
import api from './axiosInstance';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@context/authContext';

export const TransactionContext = createContext();

const getTransacoes = async () => {
    try {
        console.log('Iniciando requisição para transações...');
        const { data } = await api.get('/profile/transaction/');
        return data;
    } catch (error) {
        console.log('Erro ao fazer a requisição:', error);
        throw error
    }
};

const createTransaction = async (transactionData) => {
    try {
        await api.post('/profile/transaction/', transactionData);
        return
    } catch (error) {
        console.log('Erro ao fazer a requisição:', error);
        throw error
    }
};

const deleteTransaction = async (id) => {
    try {
        await api.delete(`/profile/transaction/${id}`);
        return
    } catch (error) {
        console.log('Erro ao fazer a requisição:', error);
        throw error
    }
};

export const TransactionProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const { data: dadosAPI, isLoading, error, refetch } = useQuery({
        queryKey: ['transaction_id'],
        queryFn: getTransacoes,
        enabled: isAuthenticated,
        onSuccess: (data) => {
            console.log('Query foi bem-sucedida:', data);
        },
        onError: (error) => {
            console.log('Erro na query:', error);
        }
    })

    const createTransactionMutation = useMutation({
        mutationFn: createTransaction,
    });

    const deleteTransactionMutation = useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries(['id']);
        },
    });

    // const deleteTransaction = (id) => {
    //     deleteTransactionMutation.mutate(id);
    // };


    return (
        <TransactionContext.Provider value={{ dadosAPI, isLoading, error, refetch, createTransactionMutation, deleteTransactionMutation }}>
            {children}
        </TransactionContext.Provider>
    );
};


export const useTransactionAuth = () => {
    return useContext(TransactionContext)
};
