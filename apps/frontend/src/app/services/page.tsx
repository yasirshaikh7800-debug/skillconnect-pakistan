'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, Star, MapPin, Clock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPKR } from '@/lib/utils';
import type { ServiceCategory, ServiceItem } from '@/lib/types';

interface CategoryWithCount extends ServiceCategory {
  _count: { services: number };
}

function ServicesContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const city = searchParams.get('city') || undefined;
  const search = searchParams.get('q') || undefined;

  const { data: categories, isLoading: catsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api<CategoryWithCount[]>('/services/categories'),
  });

  const queryString = new URLSearchParams({
    ...(category ? { categorySlug: category } : {}),
    ...(city ? { city } : {}),
    ...(search ? { search } : {}),
  }).toString();

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['services', category, city, search],
    queryFn: () => api<ServiceItem[]>(`/services${queryString ? `?${queryString}` : ''}`),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 p-8 text-white shadow-2xl shadow-slate-950/20 dark:border-slate-800">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-200">
              <Sparkles className="h-4 w-4" />
              Premium marketplace search
            </div>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Find the right expert for every job.</h1>
            <p className="mt-3 text-base leading-7 text-slate-300">
              {city ? `Services in ${city}` : 'Find verified providers across Pakistan'}
              {search ? ` matching “${search}”` : ''}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Verified professionals • Transparent pricing
            </div>
          </div>
        </div>
      </div>

      {!catsLoading && categories && (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/services" className={`rounded-full border px-4 py-2 text-sm font-medium transition ${!category ? 'border-brand-500 bg-brand-600 text-white' : 'border-slate-200 text-slate-600 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300'}`}>
            All
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/services?category=${cat.slug}${city ? `&city=${city}` : ''}`} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${category === cat.slug ? 'border-brand-500 bg-brand-600 text-white' : 'border-slate-200 text-slate-600 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300'}`}>
              {cat.name} ({cat._count.services})
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        {servicesLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-[1.75rem] border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70" />
            ))}
          </div>
        ) : !services?.length ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
            No services found. Try a different city or category.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.35, delay: index * 0.04 }}>
                <Link href={`/services/${service.id}`} className="group flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">{service.category.name}</span>
                    <span className="text-lg font-semibold text-brand-600 dark:text-brand-300">{formatPKR(service.basePrice)}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">{service.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{service.description}</p>

                  <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                      <Clock className="h-3.5 w-3.5" /> {service.durationMinutes} min
                    </span>
                    {service.provider?.user?.profile?.city && (
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                        <MapPin className="h-3.5 w-3.5" /> {service.provider.user.profile.city}
                      </span>
                    )}
                    {service.provider?.rating > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> {service.provider.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {service.provider?.user?.profile?.firstName}{' '}{service.provider?.user?.profile?.lastName}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-300">
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<Loader2 className="mx-auto mt-20 h-8 w-8 animate-spin text-brand-500" />}>
      <ServicesContent />
    </Suspense>
  );
}
