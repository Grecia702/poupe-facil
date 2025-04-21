import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env'

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
        let token = null;
        token = await SecureStore.getItemAsync('jwtToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
