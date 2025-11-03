'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/Button';
import TextField from '@/components/TextField';
import PasswordField from '@/components/PasswordField';
import FormError from '@/components/FormError';

export default function ProfilePage() {
  const { isAuthenticated, profile, fetchProfile, updateProfile, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string>();
  const [info, setInfo] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProfile().catch(() => {});
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setEmail(profile.email);
      setDisplayName(profile.displayName);
    }
  }, [profile]);

  if (!isAuthenticated)
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <p className="text-neutral-600">Loading profile...</p>
      </div>
    );

  const handleCancel = () => {
    if (profile) {
      setEmail(profile.email);
      setDisplayName(profile.displayName);
      setPassword('');
      setEditing(false);
      setError(undefined);
      setInfo(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setInfo(undefined);
    setIsLoading(true);

    try {
      await updateProfile({
        ...(email ? { email } : {}),
        ...(displayName ? { displayName } : {}),
        ...(password ? { password } : {}),
      });
      setInfo('Profile updated successfully!');
      setEditing(false);
      setPassword('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50">
      {/* фон */}
      <Image
        src="/autumn-leaves.jpg"
        alt="Autumn background"
        fill
        priority
        className="object-cover opacity-30"
      />

      {/* карточка */}
      <div className="relative z-10 mx-auto w-full max-w-2xl rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-md">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-neutral-900">User Profile</h1>
          <Button onClick={logout}>Logout</Button>
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 rounded-md border border-neutral-200 bg-white p-6"
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            disabled={!editing}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Display name"
            value={displayName}
            disabled={!editing}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          {/* показываем пароль только при редактировании */}
          {editing && (
            <PasswordField
              label="New password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <FormError message={error} />
          {info && <p className="text-sm text-green-600">{info}</p>}

          {!editing ? (
            <Button
              onClick={() => setEditing(true)}
              type="button"
              className="mt-2 w-full rounded-md bg-neutral-900 py-3 text-white hover:bg-neutral-800"
            >
              Edit Information
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                isLoading={isLoading}
                type="submit"
                className="flex-1 rounded-md bg-neutral-900 py-3 text-white hover:bg-neutral-800"
              >
                Save
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-md bg-neutral-900 py-3 text-white hover:bg-neutral-800"
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
