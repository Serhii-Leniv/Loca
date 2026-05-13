import { apiRequest } from './api';
import { TrackResponseDto } from './tracks';

export type AlbumResponseDto = {
  id: string;
  title: string;
  artistName: string;
  coverImageUrl?: string;
  createdAt: string;
};

export type AlbumWithTracksResponseDto = AlbumResponseDto & {
  tracks: TrackResponseDto[];
};

export type CreateAlbumRequestDto = {
  title: string;
  artistName: string;
  coverImageUrl?: string;
};

export async function getAlbums() {
  return apiRequest<AlbumResponseDto[]>('/api/albums');
}

export async function getAlbumById(id: string) {
  return apiRequest<AlbumWithTracksResponseDto>(`/api/albums/${id}`);
}

export async function createAlbum(payload: CreateAlbumRequestDto) {
  return apiRequest<AlbumResponseDto>('/api/albums', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
