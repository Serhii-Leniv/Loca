import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

type PublicOnlyRouteProps = {
  children?: ReactNode;
};

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children ?? <Outlet />;
}