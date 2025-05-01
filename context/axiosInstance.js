import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const refreshAxios = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
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
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.data.message === 'E-mail e/ou senha incorretos!') {
            return Promise.reject(error.response.data.message);
        }


        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await SecureStore.getItemAsync('refreshToken');
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }
                const refreshResponse = await refreshAxios.post(
                    '/auth/refresh',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                        timeout: 7000,
                    }
                );
                if (refreshResponse.status !== 200 || !refreshResponse.data.newAccessToken) {
                    throw new Error("Refresh token inválido ou expirado");
                }
                const { newAccessToken } = refreshResponse.data;
                await SecureStore.setItemAsync('accessToken', newAccessToken);

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.log("Falha ao renovar token:", refreshError);
                await SecureStore.deleteItemAsync('accessToken');
                await SecureStore.deleteItemAsync('refreshToken');
                return Promise.reject(refreshError);
            }
        }
    }
);


export default api;
