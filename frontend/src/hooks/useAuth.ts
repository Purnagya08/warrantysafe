import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ApiResponse, AuthResponse } from '@/types';

export function useAuth() {
  const { setAuth, logout, user, token, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    const { user, token } = res.data.data;
    setAuth(user, token);
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    router.push('/');
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', { name, email, password });
    const { user, token } = res.data.data;
    setAuth(user, token);
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    router.push('/');
  };

  const signOut = () => {
    logout();
    document.cookie = 'token=; path=/; max-age=0';
    router.push('/login');
  };

  return { login, register, signOut, user, token, isAuthenticated };
}