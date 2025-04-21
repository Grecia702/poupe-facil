import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useMutation } from '@tanstack/react-query';
import api from './axiosInstance'
import axios from 'axios';
import { API_URL } from '@env'
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();

const postLogin = async (loginData) => {
    const res = await api.post('/auth/login', loginData);
    return res.data;
};

const postLogout = async () => {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    const res = await axios.post(`${API_URL}/auth/logout`,
        { refreshToken },
        { withCredentials: true }
    );
    return res.data;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loginMutation = useMutation({
        mutationFn: postLogin,
        onSuccess: async (data) => {
            await SecureStore.setItemAsync('jwtToken', data.accessToken);
            await SecureStore.setItemAsync('refreshToken', data.refreshToken);
            setIsAuthenticated(true);
            console.log('Login bem-sucedido', data);
        },

        onError: (error) => {
            console.error('Erro ao fazer login', error.message);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: postLogout,
        onSuccess: async () => {
            await SecureStore.deleteItemAsync('jwtToken');
            await SecureStore.deleteItemAsync('refreshToken');
            setIsAuthenticated(false);
            console.log('Logout bem-sucedido');
        },
        onError: (error) => {
            console.error('Erro ao fazer logout', error.message);
        },
    });

    useEffect(() => {
        const checkToken = async () => {
            try {
                let token = await SecureStore.getItemAsync('jwtToken');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const currentTime = Date.now() / 1000;
                    if (decodedToken.exp > currentTime) {
                        // TOKEN VÁLIDO
                        setIsAuthenticated(true);
                    } else {
                        // TOKEN EXPIRADO
                        setIsAuthenticated(false);
                    }
                }
            } catch (error) {
                console.error("Erro ao obter o token:", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkToken();
    }, []);


    return (
        <AuthContext.Provider value={{ loginMutation, logoutMutation, isAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext)
};
