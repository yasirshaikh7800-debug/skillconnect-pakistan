'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Plus, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPKR } from '@/lib/utils';

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const isVerified = user?.providerProfile?.isVerified;

  const { data: wallet } = useQuery({
    queryKey: ['provider-wallet'],
    queryFn: async () => {
      try {
        return await api<{ balance: number; currency: string }>('/payments/wallet');
      } catch {
        return { balance: 0, currency: 'PKR' };
      }
    },
  });

  const shortcuts = [
    { href: '/dashboard/provider/services', icon: Plus, label: 'My Services', desc: 'Add and manage your offerings' },
    { href: '/bookings', icon: Calendar, label: 'Job Requests', desc: 'Accept and manage bookings' },
    { href: '/wallet', icon: Briefcase, label: 'Earnings', desc: 'View wallet and payouts' },
  ];

  return (
    <AuthGuard allowedRoles={['PROVIDER', 'ADMIN']}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 p-8 text-white shadow-2xl shadow-slate-950/20 dark:border-slate-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-200">
                <Sparkles className="h-4 w-4" />
                Provider workspace
              </div>
              <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Your service business, elevated.</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">Manage your services and respond to requests from a polished dashboard built for growth.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                {isVerified ? 'Verified provider profile' : 'Verification pending'}
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">Current earnings</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{formatPKR(wallet?.balance ?? 0)}</p>
              </div>
              <div className="rounded-2xl bg-brand-500/10 p-3 text-brand-600 dark:text-brand-300">
                <Briefcase className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
              <p className="text-sm text-slate-600 dark:text-slate-400">Stay on top of your revenue and turn more requests into repeat customers.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">Your profile</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{user?.profile?.firstName} {user?.profile?.lastName}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{user?.profile?.city || 'Location not set'} • {user?.email}</p>
            {!isVerified && (
              <div className="mt-5 rounded-[1.25rem] border border-amber-300 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-700 dark:border-amber-800 dark:text-amber-400">
                CNIC verification is still pending.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {shortcuts.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.href} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                <Link href={item.href} className="group flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{item.label}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-300">
                    Open now
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AuthGuard>
  );
}
