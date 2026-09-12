'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarClock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPKR } from '@/lib/utils';
import type { BookingItem } from '@/lib/types';

function statusBadgeClass(status: BookingItem['status']) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400';
    case 'ACCEPTED':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400';
    default:
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400';
  }
}

export default function BookingsPage() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery<BookingItem[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      try {
        return await api<BookingItem[]>('/bookings');
      } catch {
        return [];
      }
    },
    staleTime: 30_000,
  });

  const [mutationError, setMutationError] = useState('');

  const updateMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: BookingItem['status'] }) => {
      return api(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      setMutationError('');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (err: unknown) => {
      setMutationError(err instanceof Error ? err.message : 'Unable to update booking status.');
    },
  });

  return (
    <AuthGuard allowedRoles={['CUSTOMER', 'PROVIDER', 'ADMIN']}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My bookings</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">Track your requests, accept updates, and stay on top of local service visits.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading bookings…
          </div>
        ) : !bookings.length ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No bookings yet. Browse services to get started.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">{booking.bookingCode}</p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{booking.service.title}</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{booking.address}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><CalendarClock className="h-4 w-4" /> {new Date(booking.scheduledAt).toLocaleString()}</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> {formatPKR(booking.totalAmount)}</span>
                  <span className="flex items-center gap-1.5"><AlertCircle className="h-4 w-4" /> {booking.provider?.email || booking.customer?.email}</span>
                </div>

                {mutationError && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                    {mutationError}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  {booking.status === 'PENDING' && (
                    <>
                      <button
                        type="button"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ bookingId: booking.id, status: 'ACCEPTED' })}
                        className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
                      >
                        Accept request
                      </button>
                      <button
                        type="button"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ bookingId: booking.id, status: 'CANCELLED' })}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 disabled:opacity-60"
                      >
                        Cancel booking
                      </button>
                    </>
                  )}
                  {booking.status === 'ACCEPTED' && (
                    <>
                      <button
                        type="button"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ bookingId: booking.id, status: 'IN_PROGRESS' })}
                        className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
                      >
                        Start visit
                      </button>
                      <button
                        type="button"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ bookingId: booking.id, status: 'CANCELLED' })}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 disabled:opacity-60"
                      >
                        Cancel booking
                      </button>
                    </>
                  )}
                  {booking.status === 'IN_PROGRESS' && (
                    <button
                      type="button"
                      disabled={updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ bookingId: booking.id, status: 'COMPLETED' })}
                      className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
                    >
                      Mark complete
                    </button>
                  )}
                  {(booking.status === 'COMPLETED' || booking.status === 'CANCELLED') && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {booking.status === 'COMPLETED' ? 'This booking is complete.' : 'This booking was cancelled.'}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
