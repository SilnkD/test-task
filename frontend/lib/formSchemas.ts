export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateDisplayName(name: string) {
  return name.trim().length >= 1 && name.trim().length <= 128;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8 || password.length > 72)
    return 'Password must be between 8 and 72 characters';
  if (!/[A-Z]/.test(password))
    return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password))
    return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password))
    return 'Password must contain at least one digit';
  if (!/[^A-Za-z0-9]/.test(password))
    return 'Password must contain at least one special symbol';
  return null;
}
