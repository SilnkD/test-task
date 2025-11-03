'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import useAuth from '@/hooks/useAuthContext';
import TextField from '@/components/TextField';
import PasswordField from '@/components/PasswordField';
import Button from '@/components/Button';
import FormError from '@/components/FormError';
import { validateEmail, validatePassword, validateDisplayName } from '@/lib/formSchemas';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';

type Form = { email: string; password: string; displayName: string };

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<Form>();
  const [serverError, setServerError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    if (!isAgreed) return; // защита на всякий случай
    setServerError(undefined);
    setIsLoading(true);
    try {
      if (!validateEmail(data.email)) throw new Error('Invalid email');

      const error = validatePassword(data.password);
      if (error) throw new Error(error);

      if (!validateDisplayName(data.displayName))
        throw new Error('Display name is too short');

      await registerUser(data.email, data.password, data.displayName);
      router.push('/login');
    } catch (e: any) {
      setServerError(e?.response?.data?.message || e?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Let’s get started!"
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <TextField
          label="Name"
          {...register('displayName', { required: 'Display name is required' })}
          error={errors.displayName?.message}
        />
        <TextField
          label="Email"
          type="email"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />
        <PasswordField
          label="Password"
          {...register('password', { required: 'Password is required' })}
          error={errors.password?.message}
        />
        <FormError message={serverError} />

        {/* чекбокс и блокировка кнопки */}
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <input
            type="checkbox"
            id="agree"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="accent-neutral-800"
          />
          <label htmlFor="agree" className="cursor-pointer">
            I agree to all Terms, Privacy Policy and Fees
          </label>
        </div>

        <Button
          isLoading={isLoading}
          type="submit"
          disabled={!isAgreed || isLoading}
          className={`w-full rounded-md py-3 text-white transition ${
            isAgreed
              ? 'bg-neutral-900 hover:bg-neutral-800'
              : 'bg-neutral-400 cursor-not-allowed'
          }`}
        >
          Sign Up
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <button onClick={() => router.push('/login')} className="underline">
          Log in
        </button>
      </p>
    </AuthLayout>
  );
}
