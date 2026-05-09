import { apiRequest } from './api';

type AuthSuccessResponse = {
  token: string;
};

type RegisterResponse = {
  message: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = LoginRequest;

export async function login(payload: LoginRequest) {
  const response = await apiRequest<AuthSuccessResponse>('/api/Auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response;
}

export async function register(payload: RegisterRequest) {
  return apiRequest<RegisterResponse>('/api/Auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function registerAndLogin(payload: RegisterRequest) {
  await register(payload);
  return login(payload);
}