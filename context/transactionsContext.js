import React, { createContext, useState, useEffect } from 'react';
import { API_URL } from '@env'
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [dadosAPI, setDadosAPI] = useState([])

    const checkDadosAPI = async () => {
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
                setDadosAPI(response.data);
            }
        }
        catch (error) {
            console.log("Erro ao fazer requisição:", error);
        }
    }

    useEffect(() => {
        checkDadosAPI();
    }, []);

    return (
        <TransactionContext.Provider value={{ dadosAPI, setDadosAPI, checkDadosAPI }} >
            {children}
        </TransactionContext.Provider >
    )
}