import api from './api';

export interface Novel {
    id: string;
    title: string;
    genre: string | null;
    description: string | null;
    is_collab: string;
    user_id: string;
    created_at: string;
}

export interface CreateNovelRequest {
    title: string;
    genre?: string;
    description?: string;
}

export interface UpdateNovelRequest {
    title?: string;
    genre?: string;
    description?: string;
    is_collab?: string;
}

export const novelService = {
    list: () =>
        api.get<Novel[]>('/novels'),

    get: (id: string) =>
        api.get<Novel>(`/novels/${id}`),

    create: (data: CreateNovelRequest) =>
        api.post<Novel>('/novels', data),

    update: (id: string, data: UpdateNovelRequest) =>
        api.patch<Novel>(`/novels/${id}`, data),

    delete: (id: string) =>
        api.delete(`/novels/${id}`),
};
