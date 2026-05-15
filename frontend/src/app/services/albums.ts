import { apiRequest } from './api';
import type { Album, AlbumDetail, ArtistMapEntry } from '../types';

export type AlbumResponseDto = Album;
export type AlbumWithTracksResponseDto = AlbumDetail;

export type CreateAlbumRequestDto = {
  title: string;
  artistName: string;
  coverImageUrl?: string;
};

export async function getAlbums() {
  return apiRequest<AlbumResponseDto[]>('/api/albums');
}

export async function getAlbumTracks(albumName: string) {
  const encodedAlbumName = encodeURIComponent(albumName.trim());
  return apiRequest<AlbumWithTracksResponseDto>(`/api/albums/${encodedAlbumName}/tracks`);
}

export async function getArtistsMapData() {
  return apiRequest<ArtistMapEntry[]>('/api/albums/map-data');
}

export async function createAlbum(payload: CreateAlbumRequestDto) {
  return apiRequest<AlbumResponseDto>('/api/albums', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
