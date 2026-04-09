import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const isOfflineCapable =
  window.location.protocol === 'file:' ||
  navigator.userAgent.includes('Electron');

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Auth disabled for development
  return <>{children}</>;
}
