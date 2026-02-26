import api from './api';

export interface Timeline {
    ID: number;
    EPISODE: number;
    SUMMARY: string;
    NOVEL_ID: number;
    CREATED_AT: string;
}

export interface CreateTimelineRequest {
    episode: number;
    summary?: string;
}

export interface UpdateTimelineRequest {
    episode?: number;
    summary?: string;
}

export const timelineService = {
    list: (novelId: string) =>
        api.get<Timeline[]>(`/novels/${novelId}/timelines`),

    get: (id: string) =>
        api.get<Timeline>(`/timelines/${id}`),

    create: (novelId: string, data: CreateTimelineRequest) =>
        api.post<Timeline>(`/novels/${novelId}/timelines`, data),

    update: (id: string, data: UpdateTimelineRequest) =>
        api.patch<Timeline>(`/timelines/${id}`, data),

    delete: (id: string) =>
        api.delete(`/timelines/${id}`),
};
