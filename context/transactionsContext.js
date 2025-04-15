import React, { createContext, useState, useEffect } from 'react';
import { API_URL } from '@env'
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [dados, setDados] = useState([])

    const checkDados = async () => {
        const token = await SecureStore.getItemAsync('jwtToken');
        if (!token) {
            console.log("Token mobile não encontrado.");
            return;
        }
        try {
            const response = await axios.get(`${API_URL}/profile/transaction/list`, {
                withCredentials: true
            });
            if (response.status === 200) {
                setDados(response.data);
            }
        }
        catch (error) {
            console.log("Erro ao fazer requisição:", error);
        }
    }

    useEffect(() => {
        checkDados();
    }, []);

    return (
        <TransactionContext.Provider value={{ dados, setDados, checkDados }} >
            {children}
        </TransactionContext.Provider >
    )
}