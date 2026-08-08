'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth, type AuthUser } from '@/context/AuthContext';
import { ApiRequestError } from '@/lib/api';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  twoFactorCode: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [needs2FA, setNeeds2FA] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    try {
      const result = await login(data.email, data.password, data.twoFactorCode);
      if (result && 'requires2FA' in result) {
        setNeeds2FA(true);
        return;
      }
      const loggedInUser = result as AuthUser;
      if (loggedInUser.role === 'PROVIDER') router.push('/dashboard/provider');
      else if (loggedInUser.role === 'ADMIN') router.push('/admin');
      else router.push('/dashboard/customer');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 items-center justify-center mb-4">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in to your SkillConnect.pk account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5"
        >
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white',
                'border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500',
              )}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              autoComplete="current-password"
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white',
                'border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500',
              )}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {needs2FA && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                2FA Code
              </label>
              <input
                {...register('twoFactorCode')}
                type="text"
                inputMode="numeric"
                placeholder="6-digit code"
                className={cn(
                  'w-full px-4 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white',
                  'border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500',
                )}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-semibold transition-colors"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
              Register
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Demo: aisha.khan@gmail.com / CustomerPass@123
        </p>
      </div>
    </div>
  );
}
