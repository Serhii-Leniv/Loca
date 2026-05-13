import { apiRequest } from './api';

export type TrackResponseDto = {
  id: string;
  title: string;
  artistName: string;
  coverImageUrl?: string;
  duration: number;
  locationName: string;
  createdAt: string;
  albumId: string;
  streamUrl?: string;
  isLiked?: boolean;
};

export type CreateTrackRequestDto = {
  title: string;
  artistName: string;
  coverImageUrl?: string;
  duration: number;
  locationName: string;
  storageFileKey: string;
  albumId: string;
};

export async function getTrackById(id: string) {
  return apiRequest<TrackResponseDto>(`/api/tracks/${id}`);
}

export async function getNearbyTracks(locationName?: string, query?: string) {
  const params = new URLSearchParams();
  if (locationName) params.append('locationName', locationName);
  if (query) params.append('q', query);
  
  const queryString = params.toString();
  return apiRequest<TrackResponseDto[]>(`/api/tracks/nearby${queryString ? `?${queryString}` : ''}`);
}

export async function createTrack(payload: CreateTrackRequestDto) {
  return apiRequest<TrackResponseDto>('/api/tracks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteTrack(id: string) {
  return apiRequest<void>(`/api/tracks/${id}`, {
    method: 'DELETE',
  });
}

export async function likeTrack(id: string) {
  return apiRequest<void>(`/api/tracks/${id}/like`, {
    method: 'POST',
  });
}

export async function unlikeTrack(id: string) {
  return apiRequest<void>(`/api/tracks/${id}/like`, {
    method: 'DELETE',
  });
}

export async function getLikedTracks() {
  return apiRequest<TrackResponseDto[]>('/api/users/me/liked-tracks');
}
