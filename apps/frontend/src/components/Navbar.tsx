'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Sun, Moon, MapPin, Search, ShieldCheck, Menu, X, LogOut, User } from 'lucide-react';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState('Karachi');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dashboardHref =
    user?.role === 'PROVIDER'
      ? '/dashboard/provider'
      : user?.role === 'ADMIN'
        ? '/admin'
        : '/dashboard/customer';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ city: selectedCity });
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    router.push(`/services?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 via-emerald-500 to-cyan-500 shadow-lg shadow-brand-500/20">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  SkillConnect<span className="text-brand-500">.pk</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Pakistan Services
                </span>
              </div>
            </Link>

            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 md:flex">
              <MapPin className="h-4 w-4 text-brand-500" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-medium outline-none"
              >
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Multan">Multan</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleSearch} className="hidden flex-1 items-center px-6 lg:flex">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search electricians, plumbers, tutors..."
                aria-label="Search services"
                className="w-full rounded-full border border-slate-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none ring-0 transition focus:border-brand-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </form>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/services" className="text-sm font-medium text-slate-600 transition hover:text-brand-500 dark:text-slate-300">
              Services
            </Link>
            {isAuthenticated && (
              <Link href={dashboardHref} className="text-sm font-medium text-slate-600 transition hover:text-brand-500 dark:text-slate-300">
                Dashboard
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="rounded-full border border-slate-200 bg-white/70 p-2 text-slate-600 transition hover:text-brand-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
              title="Toggle Theme"
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {!isLoading && isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                  <User className="h-4 w-4" />
                  {user?.profile?.firstName || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-red-500 dark:text-slate-300"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-brand-500 dark:text-slate-200">
                  Log In
                </Link>
                <Link href="/register?role=PROVIDER" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-500">
                  Become a Provider
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="rounded-full border border-slate-200 bg-white/70 p-2 text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-full border border-slate-200 bg-white/70 p-2 text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300" aria-label="Toggle navigation menu">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-slate-950/95 px-4 py-4 md:hidden">
          <div className="space-y-3">
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-slate-300 transition hover:text-brand-400">
              Services
            </Link>
            {isAuthenticated && (
              <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-slate-300 transition hover:text-brand-400">
                Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="w-full rounded-2xl border border-slate-700 py-2.5 font-medium text-white">
                Log Out
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block rounded-2xl border border-slate-700 py-2.5 text-center font-medium text-white">
                  Log In
                </Link>
                <Link href="/register?role=PROVIDER" onClick={() => setMobileMenuOpen(false)} className="block rounded-2xl bg-brand-600 py-2.5 text-center font-semibold text-white">
                  Register as Provider
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
