import api from './api';

export interface Character {
    id: number;
    name: string;
    level: number;
    stats: any;
    items: any;
    novel_id: number;
    created_at: string;
}

export interface CreateCharacterRequest {
    name: string;
    level?: number;
    stats?: any;
    items?: any;
}

export interface UpdateCharacterRequest {
    name?: string;
    level?: number;
    stats?: any;
    items?: any;
}

export const characterService = {
    list: (novelId: string) =>
        api.get<Character[]>(`/novels/${novelId}/characters`),

    get: (id: string) =>
        api.get<Character>(`/characters/${id}`),

    create: (novelId: string, data: CreateCharacterRequest) =>
        api.post<Character>(`/novels/${novelId}/characters`, data),

    update: (id: string, data: UpdateCharacterRequest) =>
        api.patch<Character>(`/characters/${id}`, data),

    delete: (id: string) =>
        api.delete(`/characters/${id}`),
};
