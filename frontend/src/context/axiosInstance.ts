import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import type { ApiResponse, ApiSuccess } from '@shared/types/ApiResponse';

const API_URL = Constants.expoConfig?.extra?.API_URL;

console.log(API_URL)

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
    withCredentials: true,
});

const refreshAxios = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
    withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    response => {
        response.data = response.data as ApiSuccess<any>;
        return response
    },
    async (error) => {
        const originalRequest = error.config;


        if (error.code === 'ECONNABORTED') {
            console.log("A requisição excedeu o tempo limite.");
            return Promise.reject(error.code);
        }

        if (error.response?.data?.message === 'E-mail e/ou senha incorretos!') {
            return Promise.reject(error.response.data.message);
        }

        if ([400, 404].includes(error.response?.status)) {
            return Promise.reject(error.response.data.message);
        }

        if (!error.response) {
            return Promise.reject('Verifique sua conexão com a internet.');
        }

        if (error.response.status === 401 && !originalRequest._retry) {
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

                if (refreshResponse.status !== 200 || !refreshResponse.headers['access-token']) {
                    throw new Error("Refresh token inválido ou expirado");
                }

                const newAccessToken = refreshResponse.headers["access-token"];

                await SecureStore.setItemAsync('accessToken', newAccessToken);

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                if (refreshError.response?.status === 429) {
                    console.log("Limite de requisições atingido.");
                    return Promise.reject(refreshError);
                }

                console.log("Falha ao renovar token:", refreshError);

                await SecureStore.deleteItemAsync('accessToken');
                await SecureStore.deleteItemAsync('refreshToken');

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
