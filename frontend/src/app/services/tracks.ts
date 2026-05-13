import { apiRequest } from './api';
import { Track } from '../types';

export interface DownloadUrlResponse {
  downloadUrl: string;
}

/**
 * Fetch tracks from the backend (optionally filtered by location)
 * @param locationName Optional location filter
 */
export async function getTracks(locationName?: string): Promise<Track[]> {
  const params = locationName ? `?locationName=${encodeURIComponent(locationName)}` : '';
  return apiRequest<Track[]>(`/api/Tracks/nearby${params}`);
}

/**
 * Fetch a single random track from the synchronized library.
 */
export async function getRandomTrack(): Promise<Track> {
  return apiRequest<Track>('/api/Tracks/random');
}

/**
 * Get a presigned download URL for streaming using storage key
 * @param key The storage file key for the track
 * @returns Response with presigned download URL
 */
export async function getStreamUrl(key: string): Promise<DownloadUrlResponse> {
  return apiRequest<DownloadUrlResponse>(`/api/Storage/download-url?key=${encodeURIComponent(key)}`, {
    method: 'GET',
  });
}

/**
 * Fetch a single track by id.
 */
export async function getTrack(trackId: string): Promise<Track> {
  return apiRequest<Track>(`/api/Tracks/${encodeURIComponent(trackId)}`);
}
