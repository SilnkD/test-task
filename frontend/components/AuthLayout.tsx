'use client';
import Image from 'next/image';
import { ReactNode } from 'react';

export default function AuthLayout({
  title,
  subtitle,
  children
}: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col md:flex-row bg-white">
      {/* Левая колонка — форма */}
      <section className="flex w-full flex-col justify-center px-8 py-12 md:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-neutral-900">{title}</h1>
            <p className="text-neutral-500 text-sm">{subtitle}</p>
          </div>
          {children}
        </div>
      </section>

      {/* Правая колонка — изображение + подложка */}
      <section className="relative hidden w-1/2 md:flex md:items-end md:justify-center overflow-hidden">
        <Image
          src="/autumn-leaves.jpg"
          alt="Autumn illustration"
          fill
          className="object-cover"
          priority
        />

        <div className="relative z-10 mb-8 mx-8 flex w-[calc(100%-4rem)] flex-col gap-2 rounded-lg bg-black/30 p-6">
          <h2 className="text-2xl font-semibold text-white">
            Discovering the Best Designs for Your Home
          </h2>
          <p className="text-sm text-neutral-200">
            Warm hues and natural shapes bring coziness to every space.
          </p>
        </div>

        </section>
    </main>
  );
}
