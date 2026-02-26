import api from './api';

export interface Foreshadow {
    ID: number;
    DESCRIPTION: string;
    RESOLVED: string;
    TIMELINE_ID: number;
    CREATED_AT: string;
}

export interface CreateForeshadowRequest {
    description: string;
}

export interface UpdateForeshadowRequest {
    description?: string;
    resolved?: string;
}

export const foreshadowService = {
    list: (timelineId: string) =>
        api.get<Foreshadow[]>(`/timelines/${timelineId}/foreshadows`),

    create: (timelineId: string, data: CreateForeshadowRequest) =>
        api.post<Foreshadow>(`/timelines/${timelineId}/foreshadows`, data),

    update: (id: string, data: UpdateForeshadowRequest) =>
        api.patch<Foreshadow>(`/foreshadows/${id}`, data),

    delete: (id: string) =>
        api.delete(`/foreshadows/${id}`),
};
