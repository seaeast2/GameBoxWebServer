import api from './api';

export interface MapItem {
    ID: number;
    IMAGE_URL: string;
    METADATA: any;
    NOVEL_ID: number;
    CREATED_AT: string;
}

export interface CreateMapRequest {
    image_url?: string;
    metadata?: any;
}

export interface UpdateMapRequest {
    image_url?: string;
    metadata?: any;
}

export const mapService = {
    list: (novelId: string) =>
        api.get<MapItem[]>(`/novels/${novelId}/maps`),

    create: (novelId: string, data: CreateMapRequest) =>
        api.post<MapItem>(`/novels/${novelId}/maps`, data),

    update: (id: string, data: UpdateMapRequest) =>
        api.patch<MapItem>(`/maps/${id}`, data),

    delete: (id: string) =>
        api.delete(`/maps/${id}`),
};
