import { apiRequest } from './api';

export type UserProfileDto = {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
};

export type UpdateProfileRequestDto = {
  username?: string;
  bio?: string;
};

export type ChangePasswordRequestDto = {
  oldPassword: string;
  newPassword: string;
};

export async function getProfile() {
  return apiRequest<UserProfileDto>('/api/users/me');
}

export async function updateProfile(payload: UpdateProfileRequestDto) {
  return apiRequest<UserProfileDto>('/api/users/me', {
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
