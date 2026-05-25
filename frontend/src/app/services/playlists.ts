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
<<<<<<< HEAD
  return apiRequest<PlaylistResponseDto>('/api/playlists', {
    method: 'POST',
=======
  const token = localStorage.getItem('loca.authToken');
  return apiRequest<PlaylistResponseDto>('/api/playlists', {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
>>>>>>> 4a6c38e1e72d24eefd42104d6bb5fcf67e275b58
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
<<<<<<< HEAD
=======

export type PlaylistDetailResponseDto = PlaylistResponseDto & {
  tracks: Array<{
    id: string;
    title: string;
    artistName: string;
    duration: number;
    coverImageUrl: string;
    isLiked?: boolean;
  }>;
};

export async function getPlaylistById(playlistId: string) {
  return apiRequest<PlaylistDetailResponseDto>(`/api/playlists/${encodeURIComponent(playlistId)}`);
}
>>>>>>> 4a6c38e1e72d24eefd42104d6bb5fcf67e275b58
