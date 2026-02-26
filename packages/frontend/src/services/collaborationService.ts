import api from './api';

export interface Collaborator {
    ID: number;
    USER_EMAIL: string;
    NICKNAME: string;
    ROLE: string;
    NOVEL_ID: number;
    CREATED_AT: string;
}

export interface CreateCollaborationRequest {
    user_email: string;
    role?: string;
}

export interface UpdateCollaborationRequest {
    role?: string;
}

export const collaborationService = {
    list: (novelId: string) =>
        api.get<Collaborator[]>(`/novels/${novelId}/collaborators`),

    create: (novelId: string, data: CreateCollaborationRequest) =>
        api.post<Collaborator>(`/novels/${novelId}/collaborators`, data),

    update: (id: string, data: UpdateCollaborationRequest) =>
        api.patch<Collaborator>(`/collaborators/${id}`, data),

    delete: (id: string) =>
        api.delete(`/collaborators/${id}`),
};
