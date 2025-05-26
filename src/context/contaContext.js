import React, { createContext, useContext, useState } from 'react';
import api from './axiosInstance';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@context/authContext';

export const ContasContext = createContext();

const getContas = async () => {
    try {
        const { data } = await api.get('/profile/account/');
        return data;
    } catch (error) {
        console.log('Erro ao fazer a requisição:', error);
        throw error;
    }
};

const getAccountBalance = async ({ queryKey }) => {
    const now = new Date();
    try {
        const [_key, params = {}] = queryKey;
        const { last_date = now } = params;

        const { data } = await api.get('/profile/account/total', {
            params: { last_date }
        });
        return data;
    } catch (error) {
        console.log('Erro ao fazer a requisição:', error);
        throw error;
    }
};


const createAccount = async (accountData) => {
    try {
        await api.post(`/profile/account/`, accountData);
    } catch (error) {
        console.log('Erro ao fazer a requisição:', error);
        throw error;
    }
};

const deleteAccount = async (id) => {
    try {
        await api.delete(`/profile/account/${id}`);
    } catch (error) {
        console.log('Erro ao fazer a requisição:', error);
        throw error;
    }
};

export const ContasProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const [lastDate, setLastDate] = useState(new Date());
    const { data: dadosContas, isLoading, error, refetch } = useQuery({
        queryKey: ['account_id'],
        queryFn: getContas,
        enabled: isAuthenticated,
        onSuccess: (data) => {
            console.log('Query foi bem-sucedida:', data);
        },
        onError: (error) => {
            console.log('Erro na query:', error);
        }
    });

    const { data: balanceAccount, refetch: refetchBalance } = useQuery({
        queryKey: ['balance_id', { last_date: lastDate }],
        queryFn: getAccountBalance,
        enabled: isAuthenticated
    });

    const createAccountMutation = useMutation({
        mutationFn: createAccount,
        enabled: isAuthenticated,
        onSuccess: () => {
            queryClient.invalidateQueries(['account_id']);
        },
    });

    const deleteContaMutation = useMutation({
        mutationFn: deleteAccount,
        enabled: isAuthenticated,
        onSuccess: () => {
            queryClient.invalidateQueries(['account_id']);
        },
        onError: (error) => {
            console.log('Erro ao deletar conta:', error);
        }
    });

    const deleteConta = (id) => {
        deleteContaMutation.mutate(id);
    };

    return (
        <ContasContext.Provider value={{
            dadosContas,
            balanceAccount,
            isLoading,
            error,
            lastDate,
            setLastDate,
            refetch,
            createAccountMutation,
            deleteConta
        }}>
            {children}
        </ContasContext.Provider>
    );
};

export const useContasAuth = () => {
    return useContext(ContasContext);
};
