import { apiRequest } from './api';

export type UserProfileDto = {
  id: string;
  email: string;
  city?: string | null;
  createdAt: string;
  likedTracksCount: number;
};

export type UpdateProfileRequestDto = {
  email: string;
  city?: string | null;
};

export type UpdateLocationRequestDto = {
  latitude: number;
  longitude: number;
};

export type ChangePasswordRequestDto = {
  currentPassword: string;
  newPassword: string;
};

export async function getProfile() {
  return apiRequest<UserProfileDto>('/api/users/me');
}

export async function updateProfile(payload: UpdateProfileRequestDto) {
  return apiRequest<void>('/api/users/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function updateLocation(payload: UpdateLocationRequestDto) {
  return apiRequest<UserProfileDto>('/api/users/me/location', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function changePassword(payload: ChangePasswordRequestDto) {
  return apiRequest<void>('/api/users/me/password', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
