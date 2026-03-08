import { api } from '@/lib/api';

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export interface User {
    userId: string;
    username: string;
    roles: string[];
}

export const login = async (credentials: FormData | { [key: string]: string }) => {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
};

export const getMe = async () => {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
};
