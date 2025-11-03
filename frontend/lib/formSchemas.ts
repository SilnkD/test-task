export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateDisplayName(name: string) {
  return name.trim().length >= 1 && name.trim().length <= 128;
}

export function validatePassword(password: string): string | null {
  const errors: string[] = [];

  if (password.length < 8)
    errors.push('Password must be at least 8 characters long');
  if (password.length > 72)
    errors.push('Password must not exceed 72 characters');
  if (!/[A-Z]/.test(password))
    errors.push('Password must contain at least one uppercase letter');
  if (!/[a-z]/.test(password))
    errors.push('Password must contain at least one lowercase letter');
  if (!/[0-9]/.test(password))
    errors.push('Password must contain at least one digit');
  if (!/[^A-Za-z0-9]/.test(password))
    errors.push('Password must contain at least one special symbol');

  return errors.length > 0 ? errors.join('\n') : null;
}