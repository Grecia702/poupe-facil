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

    const logout = () => {
        Cookies.remove('jwtToken');
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const checkCookies = async () => {
            try {
                if (Platform.OS === 'web') {
                    const token = Cookies.get('jwtToken');
                    setIsLoggedIn(!!token);
                    setIsLoading(false);
                }
                else {
                    const token = await SecureStore.getItemAsync('jwtToken');
                    console.log(token)
                    setIsLoggedIn(!!token)
                    setIsLoading(false);
                }
            }
            catch (error) {
                console.error("Erro ao obter o token:", error);
            }
        };
        checkCookies();
    }, []);



    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue' }}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout, setIsLoading, isReady }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
