import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env'

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    async (config) => {
        let token = null;
        token = await SecureStore.getItemAsync('accessToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    async (response) => {
        if (response.data?.newAccessToken) {
            await SecureStore.setItemAsync('accessToken', response.data.newAccessToken);
            console.log('Novo access token salvo!');
        }
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            console.log('Sessão expirada. Redirecionando para login.');
        }
        return Promise.reject(error);
    }
);


export default api;
