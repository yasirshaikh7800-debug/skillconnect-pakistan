'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BadgeCheck, Clock, MapPin, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { BookingFlow } from '@/components/BookingFlow';
import { api } from '@/lib/api';
import { formatPKR } from '@/lib/utils';
import type { ServiceItem } from '@/lib/types';

function fallbackService(id: string): ServiceItem {
  return {
    id,
    title: 'Electrical wiring and outlet installation',
    description:
      'Fast, safe electrical repairs and installations for homes and small businesses in Karachi and Lahore.',
    basePrice: 1800,
    durationMinutes: 90,
    isAvailable: true,
    category: {
      id: 'cat-1',
      name: 'Electrical & Wiring',
      slug: 'electrical-wiring',
      description: 'Certified electrical work',
    },
    provider: {
      id: 'provider-1',
      cnicNumber: '42101-1234567-1',
      isVerified: true,
      hourlyRate: 1800,
      rating: 4.9,
      totalReviews: 128,
      serviceRadiusKm: 15,
      user: {
        id: 'user-1',
        email: 'aisha.khan@example.com',
        profile: {
          firstName: 'Aisha',
          lastName: 'Khan',
          city: 'Karachi',
          bio: 'Certified electrician with 8 years of experience.',
        },
      },
    },
  };
}

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.serviceId as string;

  const { data: service, isLoading } = useQuery<ServiceItem>({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      try {
        return await api<ServiceItem>(`/services/${serviceId}`);
      } catch {
        return fallbackService(serviceId);
      }
    },
    staleTime: 60_000,
  });

  if (isLoading || !service) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-20 text-slate-600 dark:text-slate-400">
        Loading service details…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-950 dark:text-brand-400">
                {service.category.name}
              </span>
              {service.isAvailable && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  Available now
                </span>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{service.title}</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">{service.description}</p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-500" /> {service.durationMinutes} min
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-brand-500" /> {service.provider.user?.profile?.city || 'Pakistan'}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /> {service.provider.rating.toFixed(1)} ({service.provider.totalReviews} reviews)
              </span>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Provider profile</h2>
              <Link href={`/providers/${service.provider.id}`} className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
                View full profile
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
                <ShieldCheck className="h-6 w-6 text-brand-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {service.provider.user?.profile?.firstName} {service.provider.user?.profile?.lastName}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {service.provider.isVerified ? 'CNIC verified' : 'Verification pending'} • {service.provider.serviceRadiusKm} km radius
                </p>
              </div>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              {service.provider.user?.profile?.bio || 'Experienced service provider committed to transparent pricing and reliable visits.'}
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent reviews</h2>
            <div className="mt-5 space-y-4">
              {[
                {
                  name: 'Hina Ali',
                  rating: 5,
                  review: 'Arrived on time and solved the issue cleanly. Excellent communication.',
                },
                {
                  name: 'Nabeel Qureshi',
                  rating: 5,
                  review: 'Fair pricing and professional workmanship. Highly recommended.',
                },
              ].map((review) => (
                <div key={review.name} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900 dark:text-white">{review.name}</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{review.review}</p>
                </div>
              ))}
            </div>
            <Link href="/reviews" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
              See all reviews <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>

        <div className="space-y-6">
          <BookingFlow service={service} />

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
              <Sparkles className="h-5 w-5" />
              <p className="font-semibold">Why customers choose SkillConnect</p>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-500" />Verified professionals with CNIC checks</li>
              <li className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-500" />Transparent pricing in PKR</li>
              <li className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-500" />Safe booking and status tracking</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
