import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth as useAuthContext } from '@/components/AuthContext';

export function useAuth(requiredRole?: string) {
  const { user, isLoading: loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requiredRole && (!user || (user.role !== requiredRole && user.role !== 'admin'))) {
        router.push(user ? '/' : '/login');
      }
    }
  }, [user, loading, router, requiredRole]);

  return { user, loading };
}
