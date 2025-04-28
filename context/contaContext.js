import React, { createContext, useContext } from 'react';
import api from './axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@context/authContext';

export const ContasContext = createContext();

const getContas = async () => {
    try {
        const { data } = await api.get('/profile/account/');
        return data;
    } catch (error) {
        console.log('Erro ao fazer a requisição:', error);
        throw error
    }
};

export const ContasProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
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
    })

    return (
        <ContasContext.Provider value={{ dadosContas, isLoading, error, refetch }}>
            {children}
        </ContasContext.Provider>
    );
};


export const useContasAuth = () => {
    return useContext(ContasContext)
};
