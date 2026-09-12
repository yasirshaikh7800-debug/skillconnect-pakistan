'use client';

import React, { useState } from 'react';
import { SAMPLE_BOOKINGS } from '@/lib/mockData';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, MapPin, CreditCard } from 'lucide-react';
import AiCareerInsightsCard from '@/components/ai/AiCareerInsightsCard';

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState(SAMPLE_BOOKINGS);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Customer & Career Dashboard
        </h1>
        <p className="text-xs text-slate-500">
          Track active service bookings, AI career recommendations, payment receipts & completed work
        </p>
      </div>

      {/* AI Career Insights Section */}
      <AiCareerInsightsCard />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Active Bookings</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">1</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Total Spent (PKR)</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">PKR 4,000</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Saved Address</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
            DHA Phase 5, Karachi
          </p>
        </div>
      </div>

      {/* Active & Past Bookings */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          My Service Requests
        </h2>

        <div className="space-y-4">
          {bookings.map((booking) => {
            const isCompleted = booking.status === 'COMPLETED';
            return (
              <div
                key={booking.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      REF: {booking.bookingCode}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {booking.service.title}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="block text-slate-400 text-[10px]">Assigned Worker</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">
                      {booking.provider?.profile?.firstName} {booking.provider?.profile?.lastName}
                    </span>
                  </div>

                  <div>
                    <span className="block text-slate-400 text-[10px]">Location Address</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {booking.address}
                    </span>
                  </div>

                  <div>
                    <span className="block text-slate-400 text-[10px]">Scheduled Time</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {new Date(booking.scheduledAt).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="block text-slate-400 text-[10px]">Total Fee (PKR)</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      PKR {booking.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                  <button
                    onClick={() => alert(`Calling Customer Support for ${booking.bookingCode}`)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    Support / Dispute
                  </button>
                  <button
                    onClick={() => alert('JazzCash / EasyPaisa Payment Invoice Downloaded!')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                  >
                    View Receipt
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
