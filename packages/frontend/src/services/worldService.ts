import api from './api';

export interface World {
    ID: number;
    NAME: string;
    DESCRIPTION: string;
    METADATA: any;
    NOVEL_ID: number;
    CREATED_AT: string;
}

export interface CreateWorldRequest {
    name: string;
    description?: string;
    metadata?: any;
}

export interface UpdateWorldRequest {
    name?: string;
    description?: string;
    metadata?: any;
}

export const worldService = {
    list: (novelId: string) =>
        api.get<World[]>(`/novels/${novelId}/worlds`),

    create: (novelId: string, data: CreateWorldRequest) =>
        api.post<World>(`/novels/${novelId}/worlds`, data),

    update: (id: string, data: UpdateWorldRequest) =>
        api.patch<World>(`/worlds/${id}`, data),

    delete: (id: string) =>
        api.delete(`/worlds/${id}`),
};
