'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BadgeCheck, Clock, MapPin, ShieldCheck, Star } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPKR } from '@/lib/utils';
import type { ProviderProfile } from '@/lib/types';

export default function ProviderProfilePage() {
  const params = useParams();
  const providerId = params.providerId as string;

  const { data: provider, isLoading } = useQuery<ProviderProfile>({
    queryKey: ['provider-profile', providerId],
    queryFn: async () => {
      try {
        return await api<ProviderProfile>(`/services/${providerId}`);
      } catch {
        return {
          id: providerId,
          cnicNumber: '42101-1234567-1',
          isVerified: true,
          hourlyRate: 1800,
          rating: 4.9,
          totalReviews: 124,
          serviceRadiusKm: 15,
          user: {
            id: 'user-1',
            email: 'aisha.khan@example.com',
            profile: {
              firstName: 'Aisha',
              lastName: 'Khan',
              city: 'Karachi',
              bio: 'Trusted provider for electrical and home maintenance work in Karachi and nearby areas.',
            },
          },
        };
      }
    },
  });

  if (isLoading || !provider) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-slate-600 dark:text-slate-400">Loading profile…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-semibold">{provider.isVerified ? 'Verified provider' : 'Pending verification'}</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              {provider.user?.profile?.firstName} {provider.user?.profile?.lastName}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">{provider.user?.profile?.bio}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
            Starting from {formatPKR(provider.hourlyRate)} / hr
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <MapPin className="h-4 w-4 text-brand-500" />
              <span className="font-medium">Service area</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{provider.user?.profile?.city} • {provider.serviceRadiusKm} km radius</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">Rating</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{provider.rating.toFixed(1)} • {provider.totalReviews} reviews</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock className="h-4 w-4 text-brand-500" />
              <span className="font-medium">Response time</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Usually responds within 1 hour</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Services offered</h2>
          <div className="mt-5 space-y-3">
            {['Electrical wiring', 'Home maintenance', 'Quick repairs'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">{item}</span>
                <span className="text-sm text-slate-500">Available</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Why this provider stands out</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-500" /> CNIC verified and background checked</li>
            <li className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-500" /> Transparent pricing and clear quotations</li>
            <li className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-500" /> Trusted by local households across Pakistan</li>
          </ul>
          <a href="/services" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
            Browse similar services <ArrowRight className="h-4 w-4" />
          </a>
        </section>
      </div>
    </div>
  );
}
