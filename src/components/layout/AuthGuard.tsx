
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  adminOnly = false,
}) => {
  const { isAuthenticated, loading, demoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        // Redirect to login if authentication is required but user is not authenticated
        navigate('/demo-login', { state: { from: location.pathname } });
      } else if (adminOnly && demoRole !== 'administrator') {
        // Redirect to dashboard if admin access is required but user is not an admin
        navigate('/dashboard', { state: { error: 'Insufficient permissions' } });
      }
    }
  }, [isAuthenticated, loading, requireAuth, adminOnly, demoRole, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-midnight-900 to-midnight-950">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin text-gold-400 mx-auto" />
          <p className="mt-4 text-gold-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null; // Don't render anything, will redirect in the useEffect
  }

  if (adminOnly && demoRole !== 'administrator') {
    return null; // Don't render anything, will redirect in the useEffect
  }

  return <>{children}</>;
};

export default AuthGuard;
