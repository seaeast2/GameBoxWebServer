import api from './api';

export interface EpisodeText {
    content: string;
    episode: number;
    novel_id: string;
    episode_id: string;
    updated_at: string;
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
