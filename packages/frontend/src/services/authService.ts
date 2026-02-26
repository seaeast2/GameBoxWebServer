import api from './api';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    nickname: string;
}

export interface AuthResponse {
    user: {
        id: number;
        email: string;
        nickname: string;
        role: string;
    };
    access_token: string;
}

export interface UserProfile {
    ID: number;
    EMAIL: string;
    NICKNAME: string;
    ROLE: string;
    PLAN: string;
    CREATED_AT: string;
}

export const authService = {
    login: (data: LoginRequest) =>
        api.post<AuthResponse>('/auth/login', data),

    signup: (data: SignupRequest) =>
        api.post<AuthResponse>('/auth/signup', data),

    getMe: () =>
        api.get<UserProfile>('/users/me'),

    updateMe: (data: { nickname?: string; password?: string }) =>
        api.patch<UserProfile>('/users/me', data),
};
