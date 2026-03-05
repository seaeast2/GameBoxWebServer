import api from './api';

export interface World {
    id: number;
    name: string;
    description: string;
    metadata: any;
    novel_id: number;
    created_at: string;
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
