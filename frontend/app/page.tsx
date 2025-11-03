'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/Button';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="/autumn-leaves.jpg"
        alt="Autumn background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-white/10 to-transparent" />
      <div className="relative z-10 flex flex-col items-center rounded-xl bg-white/80 p-12 shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-semibold text-neutral-900 mb-4">Welcome to the Authentication App</h1>
        <p className="max-w-md text-neutral-700 text-center mb-6">
          {isAuthenticated
            ? 'You are already logged in — go to your profile to edit your data.'
            : 'Sign in or create a new account to get started.'}
        </p>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <Button onClick={() => router.push('/profile')}>Go to Profile</Button>
          ) : (
            <>
              <Button onClick={() => router.push('/login')}>Log In</Button>
              <Button onClick={() => router.push('/register')}>Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
