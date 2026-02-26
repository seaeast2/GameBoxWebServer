import api from './api';

export interface Novel {
    ID: number;
    TITLE: string;
    GENRE: string;
    DESCRIPTION: string;
    IS_COLLAB: string;
    USER_ID: number;
    CREATED_AT: string;
    UPDATED_AT: string;
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
