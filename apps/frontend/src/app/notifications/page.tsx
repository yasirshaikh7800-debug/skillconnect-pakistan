'use client';

import Link from 'next/link';
import { BellRing, CalendarClock, ShieldCheck } from 'lucide-react';

const notifications = [
  {
    title: 'Booking confirmed',
    description: 'Your electrician booking for Friday afternoon has been accepted by the provider.',
    time: '10 mins ago',
    icon: CalendarClock,
  },
  {
    title: 'Verification update',
    description: 'Your CNIC document is now under review. We will notify you once it is verified.',
    time: '1 hour ago',
    icon: ShieldCheck,
  },
  {
    title: 'New review received',
    description: 'A customer left a 5-star review for your recent service visit.',
    time: '2 hours ago',
    icon: BellRing,
  },
];

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Keep up with booking changes, reviews, and verification updates.</p>
        </div>
        <Link href="/bookings" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300">
          View bookings
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold text-slate-900 dark:text-white">{item.title}</h2>
                  <span className="text-sm text-slate-500">{item.time}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
