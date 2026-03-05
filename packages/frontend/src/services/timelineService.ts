import api from './api';

export interface Timeline {
    id: number;
    episode: number;
    summary: string;
    novel_id: number;
    created_at: string;
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
