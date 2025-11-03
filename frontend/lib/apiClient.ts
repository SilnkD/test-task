import axios from 'axios';
import {
  readAccessToken,
  readRefreshToken,
  saveTokens,
  clearTokens,
} from './authStorage';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

/* ----------------- токен в заголовок ----------------- */
let accessToken: string | null = readAccessToken();
export function setAccessToken(token: string | null) {
  accessToken = token;
}
apiClient.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

/* ----------------- onUnauthorized (для логаута) ----------------- */
export type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;
export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  onUnauthorized = handler;
}

/* ----------------- refresh очередь ----------------- */
let isRefreshing = false;
let failedQueue: Array<{ resolve: (t?: string) => void; reject: (e: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token || undefined)));
  failedQueue = [];
};

/* ----------------- редирект на /error для 5xx ----------------- */
let hardErrorRedirectInProgress = false;
function redirectToError() {
  if (typeof window === 'undefined') return;
  if (hardErrorRedirectInProgress) return;
  if (window.location.pathname === '/error') return;
  hardErrorRedirectInProgress = true;
  // используем «ванильный» редирект — он работает из любого места
  window.location.assign('/error');
}

/* ----------------- интерцептор ответов ----------------- */
apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    const originalRequest = err.config;

    // 5xx -> глобальная страница ошибки
    if (status && status >= 500) {
      redirectToError();
      return Promise.reject(err);
    }

    // 401 -> refresh
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const r = readRefreshToken();
        if (!r) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken: r });

        const newAccess = data?.accessToken;
        const newRefresh = data?.refreshToken || r;

        if (!newAccess) throw new Error('No access token from refresh');

        saveTokens(newAccess, newRefresh);
        setAccessToken(newAccess);
        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        if (onUnauthorized) onUnauthorized();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // остальные ошибки (400/403/422/409 и т.п.) — отдаем в catch компонента
    return Promise.reject(err);
  }
);

export default apiClient;
