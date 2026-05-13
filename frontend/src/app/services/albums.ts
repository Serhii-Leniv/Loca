import { apiRequest } from './api';
import { Album, AlbumDetail } from '../types';

export async function getAlbums(): Promise<Album[]> {
  return apiRequest<Album[]>('/api/albums');
}

export async function getAlbumTracks(albumName: string): Promise<AlbumDetail> {
  const encodedAlbumName = encodeURIComponent(albumName.trim());
  return apiRequest<AlbumDetail>(`/api/albums/${encodedAlbumName}/tracks`);
}
