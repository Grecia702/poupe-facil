import React, { createContext, useContext } from 'react';
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

    const { data: dadosContas, isLoading, error, refetch } = useQuery({
        queryKey: ['id'],
        queryFn: getContas,
        enabled: isAuthenticated,
        onSuccess: (data) => {
            console.log('Query foi bem-sucedida:', data);
        },
        onError: (error) => {
            console.log('Erro na query:', error);
        }
    });

    const createAccountMutation = useMutation({
        mutationFn: createAccount,
    });


    const deleteContaMutation = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries(['id']);
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
            isLoading,
            error,
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
