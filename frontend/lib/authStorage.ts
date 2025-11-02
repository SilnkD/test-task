const KEY = 'auth_token';

export function saveToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem(KEY, token);
}
export function readToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
}
export function clearToken() {
  if (typeof window !== 'undefined') localStorage.removeItem(KEY);
}
