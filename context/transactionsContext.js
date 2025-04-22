import React, { createContext, useContext } from 'react';
import api from './axiosInstance';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@env'

export const TransactionContext = createContext();

const getTransacoes = async () => {
    try {
        console.log('Iniciando requisição para transações...');
        const { data } = await api.get('/profile/transaction/');
        return data;
    } catch (error) {
        console.log('Erro ao fazer a requisição:', error);
        throw error;  // Não esquecer de re-lançar o erro para o React Query lidar com ele.
    }
};
export const TransactionProvider = ({ children }) => {

    const { data: dadosAPI, isLoading, error, refetch } = useQuery({
        queryKey: ['transaction_id'],
        queryFn: getTransacoes,
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
