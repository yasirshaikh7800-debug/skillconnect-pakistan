'use client';

import React, { useState } from 'react';
import { SAMPLE_BOOKINGS } from '@/lib/mockData';
import { ShieldCheck, CheckCircle2, Wallet, Plus, Star, MapPin, AlertCircle } from 'lucide-react';

export default function ProviderDashboardPage() {
  const [walletBalance, setWalletBalance] = useState(14500);
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="space-y-8">
      {/* Header with Status Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Provider Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CNIC Verified</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Manage incoming repair requests, wallet balance in PKR, and service areas
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Work Availability
          </span>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              isOnline
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}
          >
            {isOnline ? 'ONLINE (Ready for Jobs)' : 'OFFLINE'}
          </button>
        </div>
      </div>

      {/* Wallet & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400">Total Earnings Wallet</span>
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black">PKR {walletBalance.toLocaleString()}</p>
          <div className="pt-2 flex space-x-2">
            <button
              onClick={() => alert('Payout requested to your JazzCash / Bank Account!')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Withdraw to JazzCash
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Jobs Completed</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white">84</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            98% Positive Customer Feedback
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Rating & CNIC</span>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-500 fill-current" />
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">4.9 / 5.0</span>
          </div>
          <p className="text-[11px] text-slate-400">CNIC # 42101-1234567-1 Verified</p>
        </div>
      </div>

      {/* Incoming Service Orders */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Assigned Service Orders
        </h2>

        <div className="space-y-4">
          {SAMPLE_BOOKINGS.map((booking) => (
            <div
              key={booking.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    ORDER: {booking.bookingCode}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {booking.service.title}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 block">Payout Amount</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    PKR {booking.providerEarning.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <span className="block text-slate-400 text-[10px]">Customer Name</span>
                  <span className="font-bold text-slate-900 dark:text-slate-200">
                    {booking.customer?.profile?.firstName} {booking.customer?.profile?.lastName}
                  </span>
                </div>

                <div>
                  <span className="block text-slate-400 text-[10px]">Job Address</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {booking.address}
                  </span>
                </div>

                <div>
                  <span className="block text-slate-400 text-[10px]">Status</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  onClick={() => alert(`Marked Job ${booking.bookingCode} as Completed!`)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Mark Work Completed
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
