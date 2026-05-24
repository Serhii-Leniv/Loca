import { apiRequest } from './api';

export type PendingTrack = {
    id: string;
    title: string;
    artistName: string;
    createdAt: string;
    streamUrl: string | null;
};

export async function getPendingTracks() {
    return apiRequest<PendingTrack[]>('/api/moderation/tracks/pending');
}

export async function approveTrack(id: string) {
    return apiRequest<{ message: string }>(`/api/moderation/tracks/${id}/approve`, {
        method: 'POST',
    });
}

export async function rejectTrack(id: string) {
    return apiRequest<{ message: string }>(`/api/moderation/tracks/${id}/reject`, {
        method: 'POST',
    });
}