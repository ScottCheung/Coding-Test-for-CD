import axios from 'axios';
import { useAuthStore } from '@/lib/store';
import { notify } from "@/lib/notifications";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://platform.ezeas.com/';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthMe = error.config?.url?.includes('/api/auth/me');
        const message = error.response?.data?.detail || "An unexpected error occurred";
        if (!isAuthMe || error.response?.status !== 401) {
            notify.error(message, "Error");
        }
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);
