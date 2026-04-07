import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return null; // chờ load xong
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
