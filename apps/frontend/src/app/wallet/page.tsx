'use client';

import { useQuery } from '@tanstack/react-query';
import { Wallet2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPKR } from '@/lib/utils';

export default function WalletPage() {
  const { data: wallet } = useQuery({
    queryKey: ['wallet-page'],
    queryFn: async () => {
      try {
        return await api<{ balance: number; currency: string; pendingBalance?: number }>('/payments/wallet');
      } catch {
        return { balance: 0, currency: 'PKR', pendingBalance: 0 };
      }
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Wallet</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{formatPKR(wallet?.balance ?? 0)}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Available balance in {wallet?.currency || 'PKR'}</p>
          </div>
          <div className="rounded-2xl bg-brand-100 p-4 text-brand-700 dark:bg-brand-950 dark:text-brand-400">
            <Wallet2 className="h-7 w-7" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">Pending balance</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{formatPKR(wallet?.pendingBalance ?? 0)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <ArrowDownLeft className="h-4 w-4 text-brand-500" />
              <span className="font-medium">Balance available</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{formatPKR(wallet?.balance ?? 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
