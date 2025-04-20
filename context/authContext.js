import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);

    const login = () => {
        setIsLoggedIn(true);
        setIsLoading(false);
        setIsReady(true);
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
                let token = null;
                if (Platform.OS === 'web') {
                    token = Cookies.get('jwtToken');
                } else {
                    token = await SecureStore.getItemAsync('jwtToken');
                }
                if (token) {

                    const decodedToken = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decodedToken.exp < currentTime) {
                        console.log("Token expirado.");
                        setIsLoggedIn(false);
                        // navigation.replace('login')
                    } else {
                        setIsLoggedIn(true);
                    }
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Erro ao obter o token:", error);
            } finally {
                setIsLoading(false);
                setIsReady(true);
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
