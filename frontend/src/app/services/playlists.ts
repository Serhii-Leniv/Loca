import { apiRequest } from './api';

export type PlaylistResponseDto = {
  id: string;
  name: string;
  createdAt: string;
  trackCount: number;
  coverImageUrls: string[];
  containsTrack?: boolean | null;
};

export type CreatePlaylistRequest = {
  name: string;
};

export type PlaylistTrackMutationResult = void;

export async function getPlaylists(trackId?: string) {
  const qs = trackId ? `?trackId=${encodeURIComponent(trackId)}` : '';
  return apiRequest<PlaylistResponseDto[]>(`/api/playlists${qs}`);
}

export async function createPlaylist(name: string) {
  return apiRequest<PlaylistResponseDto>('/api/playlists', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export async function addTrackToPlaylist(playlistId: string, trackId: string) {
  return apiRequest<void>(`/api/playlists/${encodeURIComponent(playlistId)}/tracks/${encodeURIComponent(trackId)}`, {
    method: 'POST',
  });
}

export async function removeTrackFromPlaylist(playlistId: string, trackId: string) {
  return apiRequest<void>(`/api/playlists/${encodeURIComponent(playlistId)}/tracks/${encodeURIComponent(trackId)}`, {
    method: 'DELETE',
  });
}
