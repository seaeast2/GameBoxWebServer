import api from './api';

export interface Version {
    id: number;
    episode: number;
    content: string;
    novel_id: number;
    created_at: string;
}

export const versionService = {
    list: (novelId: string) =>
        api.get<Version[]>(`/novels/${novelId}/versions`),

    get: (id: string) =>
        api.get<Version>(`/versions/${id}`),

    restore: (id: string) =>
        api.post(`/versions/${id}/restore`),
};
