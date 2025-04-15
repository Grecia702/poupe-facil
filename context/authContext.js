import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import * as SecureStore from 'expo-secure-store';
import { View, Text, Platform } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);

    const login = () => {
        setIsLoggedIn(true);
        setIsLoading(false)
        setIsReady(true)
    };

    const logout = async () => {
        if (Platform.OS === 'web') {
            Cookies.remove('jwtToken');
            setIsLoggedIn(false);
        }
        else {
            await SecureStore.deleteItemAsync('jwtToken');
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        const checkCookies = async () => {
            try {
                if (Platform.OS === 'web') {
                    const token = Cookies.get('jwtToken');
                    setIsLoggedIn(!!token);
                }
                else {
                    const token = await SecureStore.getItemAsync('jwtToken');
                    setIsLoggedIn(!!token)
                }
            }
            catch (error) {
                console.error("Erro ao obter o token:", error);
            }
            finally {
                setIsLoading(false);
                setIsReady(true)
            }
        };
        checkCookies();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout, isReady }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
