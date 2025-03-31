import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { View, Text } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Função de Login
    const login = () => {
        setIsLoggedIn(true);
    };

    // Função de Logout
    const logout = () => {
        Cookies.remove('jwtToken');
        setIsLoggedIn(false);
    };

    // Verifica o token salvo ao carregar o app
    useEffect(() => {
        const token = Cookies.get('jwtToken');
        setIsLoggedIn(!!token); // Se token existir, usuário está logado
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);
