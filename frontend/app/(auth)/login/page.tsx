'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import useAuth from '@/hooks/useAuthContext';
import TextField from '@/components/TextField';
import PasswordField from '@/components/PasswordField';
import Button from '@/components/Button';
import FormError from '@/components/FormError';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';

type Form = { loginOrEmail: string; password: string };

export default function LoginPage() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<Form>();
  const [serverError, setServerError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    setServerError(undefined); setIsLoading(true);
    try { await login(data.loginOrEmail, data.password); }
    catch (e: any) { setServerError(e?.response?.data?.message || 'Login failed'); }
    finally { setIsLoading(false); }
  });

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Welcome back — please log in to continue"
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <TextField label="Login or Email" {...register('loginOrEmail', { required: 'Login or Email is required' })} error={errors.loginOrEmail?.message}/>
        <PasswordField label="Password" {...register('password', { required: 'Password is required' })} error={errors.password?.message}/>
        <FormError message={serverError}/>
        <Button isLoading={isLoading} type="submit" className="w-full rounded-md bg-neutral-900 py-3 text-white hover:bg-neutral-800">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        Don’t have an account?{' '}
        <button onClick={() => router.push('/register')} className="underline">Sign up</button>
      </p>
    </AuthLayout>
  );
}
