import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'candidate' | 'company';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'candidate' }) => {
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('[ProtectedRoute] No user, redirecting to login');
        window.location.href = '/login';
      } else if (requiredRole && user.role !== requiredRole) {
        console.log(`[ProtectedRoute] Wrong role: ${user.role}, need ${requiredRole}`);
        const redirectPath = user.role === 'company' ? '/company' : '/dashboard';
        window.location.href = redirectPath;
      }
    }
  }, [user, loading, requiredRole]);
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return null;
  }
  if (requiredRole && user.role !== requiredRole) {
    return null;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
