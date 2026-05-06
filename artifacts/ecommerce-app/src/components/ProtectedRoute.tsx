import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation(`/login?redirect=${encodeURIComponent(location)}`);
    }
  }, [isAuthenticated, setLocation, location]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
