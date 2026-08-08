'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ApiRequestError } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/types';

const DEFAULT_ROLE_VALUES = ['CUSTOMER', 'PROVIDER'] as const;
type RegisterRole = (typeof DEFAULT_ROLE_VALUES)[number];

const PAKISTAN_CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];

const registerSchema = z
  .object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    city: z.string().min(1, 'City is required'),
    phone: z.string().optional(),
    role: z.enum(DEFAULT_ROLE_VALUES),
    cnicNumber: z.string().optional(),
  })
  .refine((data) => data.role !== 'PROVIDER' || (data.cnicNumber && data.cnicNumber.length >= 13), {
    message: 'CNIC is required for service providers (format: 42101-1234567-1)',
    path: ['cnicNumber'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER') as RegisterRole;
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole, city: 'Karachi' },
  });

  const role = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    try {
      await registerUser(data);
      router.push(data.role === 'PROVIDER' ? '/dashboard/provider' : '/dashboard/customer');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 items-center justify-center mb-4">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Join SkillConnect.pk as a customer or service provider
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4"
      >
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
          {DEFAULT_ROLE_VALUES.map((r) => (
            <label
              key={r}
              className={cn(
                'flex items-center justify-center py-2 rounded-md text-sm font-medium cursor-pointer transition-colors',
                role === r
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400',
              )}
            >
              <input type="radio" value={r} {...register('role')} className="sr-only" />
              {r === 'CUSTOMER' ? 'Customer' : 'Provider'}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              First Name
            </label>
            <input
              {...register('firstName')}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Last Name
            </label>
            <input
              {...register('lastName')}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
          <input
            {...register('password')}
            type="password"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">City</label>
            <select
              {...register('city')}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {PAKISTAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Phone (optional)
            </label>
            <input
              {...register('phone')}
              placeholder="+923001234567"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {role === 'PROVIDER' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              CNIC Number
            </label>
            <input
              {...register('cnicNumber')}
              placeholder="42101-1234567-1"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.cnicNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.cnicNumber.message}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-semibold transition-colors"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Account
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-brand-500" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
