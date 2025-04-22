import React, { createContext, useContext } from 'react';
import api from './axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@context/authContext';

export const TransactionContext = createContext();

const getTransacoes = async () => {
    try {
        console.log('Iniciando requisição para transações...');
        const { data } = await api.get('/profile/transaction/');
        return data;
    } catch (error) {
        console.log('Erro ao fazer a requisição:', error);
        throw error;
    }
};

export const TransactionProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
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

    return (
        <TransactionContext.Provider value={{ dadosAPI, isLoading, error, refetch }}>
            {children}
        </TransactionContext.Provider>
    );
};


export const useTransactionAuth = () => {
    return useContext(TransactionContext)
};
