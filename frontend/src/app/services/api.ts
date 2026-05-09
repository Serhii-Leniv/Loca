const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5115';

const AUTH_TOKEN_KEY = 'loca.authToken';

export type ApiValidationErrors = Record<string, string[]>;

export type ApiErrorDetails = {
  message: string;
  errors?: ApiValidationErrors;
};

export class ApiError extends Error {
  readonly status: number;
  readonly details: ApiErrorDetails;

  constructor(status: number, details: ApiErrorDetails) {
    super(details.message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function resolveErrorMessage(body: unknown) {
  if (typeof body === 'string') {
    return body;
  }

  if (body && typeof body === 'object') {
    const maybeObject = body as { title?: unknown; message?: unknown };

    if (typeof maybeObject.title === 'string') {
      return maybeObject.title;
    }

    if (typeof maybeObject.message === 'string') {
      return maybeObject.message;
    }
  }

  return 'Request failed';
}

function extractValidationErrors(body: unknown): ApiValidationErrors | undefined {
  if (!body || typeof body !== 'object') {
    return undefined;
  }

  const maybeObject = body as { errors?: unknown };

  if (!maybeObject.errors || typeof maybeObject.errors !== 'object') {
    return undefined;
  }

  const validationErrors: ApiValidationErrors = {};

  for (const [field, value] of Object.entries(maybeObject.errors as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const messages = value.filter((item): item is string => typeof item === 'string');

      if (messages.length > 0) {
        validationErrors[field] = messages;
      }
    }
  }

  return Object.keys(validationErrors).length > 0 ? validationErrors : undefined;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  const body = await readResponseBody(response);

  if (!response.ok) {
    throw new ApiError(response.status, {
      message: resolveErrorMessage(body),
      errors: extractValidationErrors(body),
    });
  }

  return body as T;
}