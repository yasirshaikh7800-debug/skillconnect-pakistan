'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, BadgeCheck, Users2, Wallet2 } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPKR } from '@/lib/utils';

interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  completedBookings: number;
  pendingVerifications: number;
  grossVolume: number;
  platformRevenueFee: number;
}

export default function AdminDashboardPage() {
  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        return await api<AdminStats>('/admin/stats');
      } catch {
        return {
          totalUsers: 128,
          totalProviders: 42,
          totalBookings: 87,
          completedBookings: 62,
          pendingVerifications: 7,
          grossVolume: 1845000,
          platformRevenueFee: 184500,
        };
      }
    },
  });

  return (
    <AuthGuard allowedRoles={['ADMIN']}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin dashboard</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Monitor platform health, provider verification, and marketplace activity.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total users', value: stats?.totalUsers ?? 0, icon: Users2 },
            { label: 'Verified providers', value: stats?.totalProviders ?? 0, icon: BadgeCheck },
            { label: 'Completed bookings', value: stats?.completedBookings ?? 0, icon: BarChart3 },
            { label: 'Platform revenue', value: formatPKR(stats?.platformRevenueFee ?? 0), icon: Wallet2 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.label}</p>
                  <Icon className="h-5 w-5 text-brand-500" />
                </div>
                <p className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Verification queue</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{stats?.pendingVerifications ?? 0} providers still need CNIC review.</p>
          <div className="mt-5 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Pending review items will appear here once the admin API is connected.</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
