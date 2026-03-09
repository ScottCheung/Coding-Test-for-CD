// 认证功能已禁用

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
    throw new Error('Authentication is disabled');
};

export const getMe = async () => {
    throw new Error('Authentication is disabled');
};
