import api from './api';

export interface EpisodeText {
    CONTENT: string;
    EPISODE: number;
    NOVEL_ID: number;
}

export const episodeService = {
    getText: (novelId: string, episode: number) =>
        api.get<EpisodeText>(`/novels/${novelId}/episodes/${episode}/text`),

    saveText: (novelId: string, episode: number, content: string) =>
        api.post(`/novels/${novelId}/episodes/${episode}/text`, { content }),

    updateText: (novelId: string, episode: number, content: string) =>
        api.patch(`/novels/${novelId}/episodes/${episode}/text`, { content }),

    getVersions: (novelId: string, episode: number) =>
        api.get(`/novels/${novelId}/episodes/${episode}/versions`),

    restoreVersion: (novelId: string, episode: number, versionId: string) =>
        api.post(`/novels/${novelId}/episodes/${episode}/restore/${versionId}`),
};
