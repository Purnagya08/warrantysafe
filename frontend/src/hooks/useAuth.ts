import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AuthResponse } from '@/types';

export function useAuth() {
  const { setAuth, logout, user, token, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    setAuth(res.data.user, res.data.token);
    router.push('/');
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
    setAuth(res.data.user, res.data.token);
    router.push('/');
  };

  const signOut = () => {
    logout();
    router.push('/login');
  };

  return { login, register, signOut, user, token, isAuthenticated };
}
