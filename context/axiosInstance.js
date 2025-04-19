import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Cookies from 'js-cookie';
import { API_URL } from '@env'

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
        let token = null;

        if (Platform.OS === 'web') {
            token = Cookies.get('jwtToken');
        } else if (Platform.OS === 'android') {
            token = await SecureStore.getItemAsync('jwtToken');
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
