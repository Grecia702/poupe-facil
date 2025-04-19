import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from './axiosInstance';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [dadosAPI, setDadosAPI] = useState([]);

    const checkDadosAPI = async () => {
        try {
            const token = await SecureStore.getItemAsync('jwtToken');
            if (!token) {
                console.log("Token não encontrado");
                return;
            }
            const response = await api.get('/profile/transaction/list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            if (response.status === 200) {
                setDadosAPI(response.data);
            }
        } catch (error) {
            console.log('Erro ao fazer requisição:', error);
        }
    };

    useEffect(() => {
        checkDadosAPI();
    }, []);

    return (
        <TransactionContext.Provider value={{ dadosAPI, setDadosAPI, checkDadosAPI }}>
            {children}
        </TransactionContext.Provider>
    );
};
