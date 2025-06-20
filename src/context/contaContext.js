import React, { createContext, useContext, useState } from 'react';
import api from './axiosInstance';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@context/authContext';

export const ContasContext = createContext();

const getContas = async ({ queryKey }) => {
    const [_key, { last_date }] = queryKey;
    try {
        const { data } = await api.get('/profile/account/', {
            params: { last_date }
        });
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

const updateAccount = async ({ id, ...transactionData }) => {
    const res = await api.patch(`/profile/account/${id}`, transactionData);
    return res.data
};

const setAccountPrimary = async (id) => {
    await api.patch(`/profile/account/${id}?set_primary=true`);
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
    const { data: dadosContas, isLoading, error, refetch: refetchAccount } = useQuery({
        queryKey: ['account_id', { last_date: lastDate }],
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

    const refetchAccountNow = () => {
        const now = new Date();
        setLastDate(now);
        refetchAccount()
        refetchBalance()
    };

    const createAccountMutation = useMutation({
        mutationFn: createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['account_id'] });
        },
    });

    const updateAccountMutation = useMutation({
        mutationFn: updateAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['account_id'] });
        },
    });

    const setAccountPrimaryMutation = useMutation({
        mutationFn: setAccountPrimary,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['account_id'] });
        },
    });

    const deleteContaMutation = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['account_id'] });
        },
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
            refetchAccountNow,
            setAccountPrimaryMutation,
            createAccountMutation,
            updateAccountMutation,
            deleteConta
        }}>
            {children}
        </ContasContext.Provider>
    );
};

export const useContasAuth = () => {
    return useContext(ContasContext);
};
