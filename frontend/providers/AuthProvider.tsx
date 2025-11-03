'use client';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient, { setAccessToken, setUnauthorizedHandler } from '@/lib/apiClient';
import { readAccessToken, saveTokens, clearTokens} from '@/lib/authStorage';

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
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    clearTokens();
    setAccessToken(null);
    setProfile(null);
    router.push('/login');
  }, [router]);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  useEffect(() => {
    const token = readAccessToken();
    if (token) {
      setAccessToken(token);
      fetchProfile().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await apiClient.get<Profile>('/users/me');
      setProfile(data);
    } catch (err: any) {
      // при неожиданных ошибках (500 и т.п.) — редирект на страницу ошибки
      if (err?.response?.status >= 500) {
        router.push('/error');
      }
    }
  }, [router]);

  const login = useCallback(
    async (loginOrEmail: string, password: string) => {
      const { data } = await apiClient.post<{
        accessToken: string;
        refreshToken: string;
      }>('/auth/login', { loginOrEmail, password });

      saveTokens(data.accessToken, data.refreshToken);
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
      try {
        const res = await apiClient.patch<Profile>('/users/me', data);
        setProfile(res.data);
      } catch (err: any) {
        if (err?.response?.status >= 500) router.push('/error');
        throw err;
      }
    },
    [router]
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-neutral-600">
        Loading...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}