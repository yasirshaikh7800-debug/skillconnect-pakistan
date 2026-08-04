'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, MapPin, Search, User, ShieldCheck, Menu, X } from 'lucide-react';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [selectedCity, setSelectedCity] = useState('Karachi');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                  SkillConnect<span className="text-brand-500">.pk</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-500 dark:text-slate-400">
                  Pakistan Services
                </span>
              </div>
            </Link>

            {/* City Selector */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <MapPin className="w-4 h-4 text-brand-500" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-medium cursor-pointer focus:outline-none"
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

          {/* Search Quick Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search electricians, plumbers, AC repair in PKR..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            </div>
          </div>

          {/* Right Navigation & Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/services"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors"
            >
              Find Workers
            </Link>
            <Link
              href="/dashboard/customer"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors"
            >
              Dashboard
            </Link>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Login / Join CTA */}
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-500 px-3 py-2"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-lg shadow-md shadow-brand-500/20 transition-all"
            >
              Become a Provider
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-slate-900 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/services"
            className="block text-slate-300 hover:text-brand-400 font-medium py-2"
          >
            Services
          </Link>
          <Link
            href="/search"
            className="block text-slate-300 hover:text-brand-400 font-medium py-2"
          >
            Find Workers
          </Link>
          <Link
            href="/dashboard/customer"
            className="block text-slate-300 hover:text-brand-400 font-medium py-2"
          >
            Dashboard
          </Link>
          <div className="pt-2 flex flex-col space-y-2">
            <Link
              href="/login"
              className="w-full text-center py-2.5 rounded-lg border border-slate-700 text-white font-medium"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="w-full text-center py-2.5 rounded-lg bg-brand-600 text-white font-semibold shadow"
            >
              Register as Provider
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
