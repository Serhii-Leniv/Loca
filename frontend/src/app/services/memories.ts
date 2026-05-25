import { apiRequest, getAuthToken } from './api';

export type MemoryResponseDto = {
  id: string;
  trackId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
};

export type MemoryCarouselItemDto = {
  trackId: string;
  title: string;
  artistName: string;
  coverImageUrl?: string | null;
  username?: string | null;
  memoryId: string;
  memoryContent: string;
  createdAt: string;
};

export async function getMemoriesCarousel(limit = 20) {
  return apiRequest<MemoryCarouselItemDto[]>(`/api/memories/carousel?limit=${limit}`);
}

export async function createMemory(trackId: string, content: string) {
  return apiRequest<MemoryResponseDto>(`/api/tracks/${encodeURIComponent(trackId)}/memories`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function getRandomMemory(trackId: string): Promise<MemoryResponseDto | null> {
  const token = getAuthToken();
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? '/api'}/api/tracks/${encodeURIComponent(trackId)}/memories/random`, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 204) return null;
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Failed to fetch memory');
  }

  const body = await res.json();
  return body as MemoryResponseDto;
}

export async function getMyMemory(trackId: string): Promise<MemoryResponseDto | null> {
  return apiRequest<MemoryResponseDto | null>(`/api/tracks/${encodeURIComponent(trackId)}/memories/mine`);
}

export async function getAllMemories(trackId: string): Promise<MemoryResponseDto[]> {
  return apiRequest<MemoryResponseDto[]>(`/api/tracks/${encodeURIComponent(trackId)}/memories`);
}
