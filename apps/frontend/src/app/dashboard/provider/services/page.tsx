'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, PlusCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { cn, formatPKR } from '@/lib/utils';
import type { ServiceCategory, ServiceItem } from '@/lib/types';

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Choose a category'),
  basePrice: z.coerce.number().min(1, 'Price must be greater than zero'),
  durationMinutes: z.coerce.number().min(15, 'Duration must be at least 15 minutes'),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function ProviderServicesPage() {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<ServiceCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        return await api<ServiceCategory[]>('/services/categories');
      } catch {
        return [];
      }
    },
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      basePrice: 1500,
      durationMinutes: 60,
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: ServiceFormValues) =>
      api('/services', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return (
    <AuthGuard allowedRoles={['PROVIDER', 'ADMIN']}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My services</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Create and manage the services you offer to customers across Pakistan.</p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSubmit((values) => createMutation.mutate(values))}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-brand-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add a new service</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="title">Service title</label>
                <input
                  id="title"
                  {...register('title')}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description')}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="categoryId">Category</label>
                  <select
                    id="categoryId"
                    {...register('categoryId')}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="">Select a category</option>
                    {categoriesLoading ? (
                      <option disabled>Loading categories…</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))
                    )}
                  </select>
                  {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="basePrice">Base price (PKR)</label>
                  <input
                    id="basePrice"
                    type="number"
                    {...register('basePrice')}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  {errors.basePrice && <p className="mt-1 text-xs text-red-500">{errors.basePrice.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="durationMinutes">Estimated duration (minutes)</label>
                <input
                  id="durationMinutes"
                  type="number"
                  {...register('durationMinutes')}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {errors.durationMinutes && <p className="mt-1 text-xs text-red-500">{errors.durationMinutes.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || createMutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
              >
                {(isSubmitting || createMutation.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
                Publish service
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recommended service setup</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {[
                { title: 'Add a clear title', description: 'Use a specific title that customers search for.' },
                { title: 'Set transparent pricing', description: `Show travel and labor expectations in PKR to reduce friction.` },
                { title: 'Mention availability', description: 'Tell customers when you are available for onsite visits.' },
              ].map((tip) => (
                <div key={tip.title} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="font-semibold text-slate-900 dark:text-white">{tip.title}</p>
                  <p className="mt-1">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
