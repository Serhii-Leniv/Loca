import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { clearAuthToken, getAuthToken, setAuthToken } from '../services/api';

type JwtPayload = {
  userId?: string;
  email?: string;
  sub?: string;
  exp?: number;
  iat?: number;
};

export type AuthUser = {
  userId: string;
  email: string;
  expiresAt?: number;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
};

type AuthContextValue = AuthState & {
  signIn: (token: string) => void;
  logout: () => void;
  refreshAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = atob(padded);

    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(payload: JwtPayload | null) {
  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
}

function buildUser(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token);

  if (!payload || isTokenExpired(payload)) {
    return null;
  }

  const userId = payload.userId ?? payload.sub;
  const email = payload.email ?? 'Користувач';

  if (!userId) {
    return null;
  }

  return {
    userId,
    email,
    expiresAt: payload.exp ? payload.exp * 1000 : undefined,
  };
}

function readAuthState(): AuthState {
  const token = getAuthToken();

  if (!token) {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }

  const user = buildUser(token);

  if (!user) {
    clearAuthToken();

    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }

  return {
    token,
    user,
    isAuthenticated: true,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => readAuthState());

  const refreshAuth = () => {
    setAuthState(readAuthState());
  };

  const signIn = (token: string) => {
    setAuthToken(token);
    setAuthState({
      token,
      user: buildUser(token),
      isAuthenticated: true,
    });
  };

  const logout = () => {
    clearAuthToken();
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  };

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'loca.authToken') {
        refreshAuth();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...authState,
      signIn,
      logout,
      refreshAuth,
    }),
    [authState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}