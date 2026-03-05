import api from './api';

export interface Character {
    id: number;
    name: string;
    level: number;
    // TODO : 성격, 말투, 트라우마, 비밀, 약점, 강점, 소속, 관계, 호감, 비호감, 외모
    // TODO : 캐릭터 사진링크
    stats: any; // 능력치
    items: any; // 현재 소유 아이템
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
