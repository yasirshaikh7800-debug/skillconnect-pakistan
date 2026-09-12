'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Loader2, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ApiRequestError, api } from '@/lib/api';
import { cn, formatPKR } from '@/lib/utils';
import type { ServiceItem } from '@/lib/types';

const BookingSuccess3DModal = dynamic(() => import('./BookingSuccess3DModal'), {
  ssr: false,
});

const bookingSchema = z.object({
  scheduledAt: z.string().min(1, 'Choose a date and time'),
  address: z.string().min(1, 'Please enter an address'),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFlowProps {
  service: ServiceItem | null;
}

export function BookingFlow({ service }: BookingFlowProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'CASH_ON_DELIVERY'>('STRIPE');
  const [successModal, setSuccessModal] = useState<{ bookingCode: string; serviceTitle: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 16),
      address: '',
      notes: '',
    },
  });

  if (!service) {
    return null;
  }

  const onSubmit = async (values: BookingFormValues) => {
    setError('');
    setStatusMessage('');

    if (!isAuthenticated) {
      setError('Please sign in before booking this service.');
      return;
    }

    try {
      const booking = await api<{ id: string; bookingCode: string; service: { title: string } }>('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: service.id,
          scheduledAt: values.scheduledAt,
          address: values.address,
          latitude: 24.8607,
          longitude: 67.0711,
          notes: values.notes,
        }),
      });

      const payment = await api<{ message: string }>('/payments/initiate', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: booking.id,
          method: paymentMethod,
        }),
      });

      setStatusMessage(`${payment.message} Your booking request has been submitted.`);
      setSuccessModal({
        bookingCode: booking.bookingCode,
        serviceTitle: booking.service?.title || service.title,
      });
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to create the booking right now.');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Book this service</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
            {formatPKR(service.basePrice)}
          </h2>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          {service.durationMinutes} min visit
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}
        {statusMessage && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
            {statusMessage}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="scheduledAt">
            Preferred time
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              id="scheduledAt"
              type="datetime-local"
              {...register('scheduledAt')}
              className={cn(
                'w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white',
              )}
            />
          </div>
          {errors.scheduledAt && <p className="mt-1 text-xs text-red-500">{errors.scheduledAt.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="address">
            Service address
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              id="address"
              {...register('address')}
              placeholder="House 42, Block 6, Karachi"
              className={cn(
                'w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white',
              )}
            />
          </div>
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="notes">
            Notes for the provider
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={4}
            placeholder="Describe the issue or any special instructions"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Payment method
          </label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {[
              { value: 'STRIPE', label: 'Card / Stripe' },
              { value: 'CASH_ON_DELIVERY', label: 'Cash on delivery' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPaymentMethod(option.value as 'STRIPE' | 'CASH_ON_DELIVERY')}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  paymentMethod === option.value
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-950/40 dark:text-brand-400'
                    : 'border-slate-200 text-slate-700 hover:border-brand-500 dark:border-slate-700 dark:text-slate-300',
                )}
              >
                <CreditCard className="h-4 w-4" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Request Booking
        </button>
      </form>

      {successModal && (
        <BookingSuccess3DModal
          bookingCode={successModal.bookingCode}
          serviceTitle={successModal.serviceTitle}
          onClose={() => {
            setSuccessModal(null);
            router.push('/bookings');
          }}
        />
      )}
    </div>
  );
}
