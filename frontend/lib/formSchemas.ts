export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export function validatePassword(password: string) {
  return password.trim().length >= 6;
}
export function validateDisplayName(name: string) {
  return name.trim().length >= 2;
}
