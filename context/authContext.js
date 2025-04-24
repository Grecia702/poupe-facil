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

const postSignUp = async (signUpData) => {
    const res = await api.post('/auth/signup', signUpData);
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
            await SecureStore.setItemAsync('accessToken', data.accessToken);
            await SecureStore.setItemAsync('refreshToken', data.refreshToken);
            setIsAuthenticated(true);
            console.log('Login bem-sucedido', data);
        },

        onError: (error) => {
            console.error('Erro ao fazer login', error.message);
        },
    });

    const signUpMutation = useMutation({
        mutationFn: postSignUp,
        onSuccess: async (data) => {
            ;
            console.log('Usuário Cadastrado com sucesso', data);
        },
        onError: (error) => {
            console.error('Erro ao fazer cadastro', error.message);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            return axios.post(`${API_URL}/auth/logout`, {}, {
                headers: { Authorization: `Bearer ${refreshToken}` },
                timeout: 3000,
                validateStatus: () => true,
            });
        },
        onSuccess: async (responseLogout) => {
            if (responseLogout.status === 200) {
                await SecureStore.deleteItemAsync('accessToken');
                await SecureStore.deleteItemAsync('refreshToken');
                setIsAuthenticated(false);
                console.log('Logout bem-sucedido');
            } else {
                console.log("Erro ao apagar token:", responseLogout.data.message);
                throw new Error(responseLogout.data.message);
            }
        },
        onError: (error) => {
            console.error('Erro ao fazer logout:', error.message);
        },
    });


    // Função pra manter o usuario logado / renovar tokens de acessos
    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('accessToken');
                const expired = !token || jwtDecode(token).exp < Date.now() / 1000;
                if (!expired) {
                    setIsAuthenticated(true);
                    return setIsLoading(false);
                }
                const refreshToken = await SecureStore.getItemAsync('refreshToken');
                if (!refreshToken) {
                    console.log("Nenhum refresh token encontrado.");
                    await SecureStore.deleteItemAsync('accessToken');
                    await SecureStore.deleteItemAsync('refreshToken');
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }
                const response = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${refreshToken}` },
                        timeout: 3000,
                        validateStatus: () => true,
                    }
                );
                if (response.status === 200) {
                    await SecureStore.setItemAsync('accessToken', response.data.newAccessToken);
                    setIsAuthenticated(true);
                } else {
                    console.log("Erro ao renovar token:", response.data.message);
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.log("Erro final:", error.message);
                await SecureStore.deleteItemAsync('accessToken');
                await SecureStore.deleteItemAsync('refreshToken');
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkToken();
    }, []);




    return (
        <AuthContext.Provider value={{ loginMutation, logoutMutation, signUpMutation, isAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext)
};
