'use client';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient, { setAccessToken, setUnauthorizedHandler } from '@/lib/apiClient';
import { readToken, saveToken, clearToken } from '@/lib/authStorage';

/* ---------- типы ---------- */
export type Profile = {
  id: string;
  email: string;
  displayName: string;
  createdAt?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  profile: Profile | null;
  login: (loginOrEmail: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: {
    email?: string;
    displayName?: string;
    password?: string;
  }) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/* ---------- провайдер ---------- */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  const logout = useCallback(() => {
    clearToken();
    setAccessToken(null);
    setProfile(null);
    router.push('/login');
  }, [router]);

  // глобальный перехват 401
  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  // загрузка профиля при наличии токена
  useEffect(() => {
    const token = readToken();
    if (token) {
      setAccessToken(token);
      fetchProfile().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- функции ---------- */
  const fetchProfile = useCallback(async () => {
    const { data } = await apiClient.get<Profile>('/users/me');
    setProfile(data);
  }, []);

  const login = useCallback(
    async (loginOrEmail: string, password: string) => {
      const { data } = await apiClient.post<{ accessToken: string }>('/auth/login', {
        loginOrEmail,
        password,
      });
      saveToken(data.accessToken);
      setAccessToken(data.accessToken);
      await fetchProfile();
      router.push('/profile');
    },
    [fetchProfile, router]
  );

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      await apiClient.post('/auth/register', {
        login: email.split('@')[0],
        email,
        password,
        displayName,
      });
    },
    []
  );

  const updateProfile = useCallback(
    async (data: { email?: string; displayName?: string; password?: string }) => {
      const res = await apiClient.patch<Profile>('/users/me', data);
      setProfile(res.data);
    },
    []
  );

  const value = useMemo(
    () => ({
      isAuthenticated: !!profile,
      profile,
      login,
      register,
      fetchProfile,
      updateProfile,
      logout,
    }),
    [profile, login, register, fetchProfile, updateProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}