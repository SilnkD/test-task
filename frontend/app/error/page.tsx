'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="/autumn-leaves.jpg"
        alt="Error background"
        fill
        priority
        className="object-cover opacity-30"
      />

      <div className="relative z-10 flex flex-col items-center rounded-xl bg-white/80 p-12 shadow-lg backdrop-blur-md text-center max-w-lg">
        <h1 className="text-4xl font-semibold text-neutral-900 mb-4">Something went wrong</h1>
        <p className="text-neutral-700 mb-8">
          We encountered an unexpected error on the server. Please try again later.
        </p>
        <Button
          onClick={() => router.push('/')}
          className="bg-neutral-900 text-white hover:bg-neutral-800"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}