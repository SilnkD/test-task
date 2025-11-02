import axios from 'axios';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
});

let accessToken: string | null = null;
export function setAccessToken(token: string | null) {
  accessToken = token;
}

apiClient.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

export type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;
export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  onUnauthorized = handler;
}

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && onUnauthorized) onUnauthorized();
    return Promise.reject(err);
  }
);

export default apiClient;