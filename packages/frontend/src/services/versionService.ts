import api from './api';

export interface Version {
    ID: number;
    EPISODE: number;
    CONTENT: string;
    NOVEL_ID: number;
    CREATED_AT: string;
}

export const versionService = {
    list: (novelId: string) =>
        api.get<Version[]>(`/novels/${novelId}/versions`),

    get: (id: string) =>
        api.get<Version>(`/versions/${id}`),

    restore: (id: string) =>
        api.post(`/versions/${id}/restore`),
};
