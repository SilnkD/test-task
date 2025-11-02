'use client';
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient, { setAccessToken, setUnauthorizedHandler } from '@/lib/apiClient';
import { readToken, saveToken, clearToken } from '@/lib/authStorage';

type Profile = { id: string; email: string; displayName: string };

type AuthContextType = {
  isAuthenticated: boolean;
  profile: Profile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: { displayName: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  const logout = useCallback(() => {
    clearToken();
    setAccessToken(null);
    setProfile(null);
    router.push('/login');
  }, [router]);

  useEffect(() => { setUnauthorizedHandler(logout); }, [logout]);

  const fetchProfile = useCallback(async () => {
    const { data } = await apiClient.get<Profile>('/users/me');
    setProfile(data);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await apiClient.post<{ accessToken: string }>('/auth/login', { email, password });
    saveToken(data.accessToken);
    setAccessToken(data.accessToken);
    await fetchProfile();
    router.push('/profile');
  }, [fetchProfile, router]);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    await apiClient.post('/auth/register', { email, password, displayName });
  }, []);

  const updateProfile = useCallback(async (data: { displayName: string }) => {
    const { data: updated } = await apiClient.patch<Profile>('/users/me', data);
    setProfile(updated);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated: !!profile, profile, login, register, logout, fetchProfile, updateProfile }),
    [profile, login, register, logout, fetchProfile, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
