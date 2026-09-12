'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SAMPLE_PROVIDERS, PAKISTAN_CITIES } from '@/lib/mockData';
import CitySearchSelect from '@/components/CitySearchSelect';

const ThreeMap3D = dynamic(() => import('@/components/ThreeMap3D'), { ssr: false });
import { ShieldCheck, MapPin, Star, Phone, MessageSquare, CheckCircle2, Search, LayoutGrid, Layers, Sparkles } from 'lucide-react';

export default function SearchWorkersPage() {
  const [selectedCity, setSelectedCity] = useState('Karachi');
  const [serviceLocation, setServiceLocation] = useState('Karachi');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatProvider, setActiveChatProvider] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Automatically update Service Location whenever top Location changes
  useEffect(() => {
    setServiceLocation(selectedCity);
  }, [selectedCity]);

  const filteredProviders = SAMPLE_PROVIDERS.filter((prov) => {
    const name = `${prov.user?.profile?.firstName} ${prov.user?.profile?.lastName}`.toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || prov.user?.profile?.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Find CNIC-Verified Skilled Workers
          </h1>
          <p className="text-xs text-slate-500">
            Directly connect with background-checked electricians, plumbers, AC experts & artisans in Pakistan
          </p>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'grid'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Worker Grid</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'map'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3D Interactive Map</span>
          </button>
        </div>
      </div>

      {/* Search & City Filter Bar with Location & Service Location */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Search Term
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search worker by name, skill, or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Location
            </label>
            <CitySearchSelect
              value={selectedCity}
              onChange={setSelectedCity}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Service Location
            </label>
            <CitySearchSelect
              value={serviceLocation}
              onChange={setServiceLocation}
            />
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Automatically filled from Location</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3D Map View Mode */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Interactive 3D Terrain, Elevation & Building Map for {selectedCity}</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">{filteredProviders.length} Workers Active</span>
          </div>
          <ThreeMap3D selectedCity={selectedCity} onCitySelect={setSelectedCity} className="w-full" />
        </div>
      ) : (
        /* Worker Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={provider.user?.avatarUrl}
                  alt={provider.user?.profile?.firstName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-1">
                      <span>
                        {provider.user?.profile?.firstName} {provider.user?.profile?.lastName}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                      PKR {provider.hourlyRate}/hr
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <span className="flex items-center space-x-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{provider.rating}</span>
                    </span>
                    <span>({provider.totalReviews} jobs)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      CNIC: {provider.cnicNumber}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 line-clamp-2">
                    {provider.user?.profile?.bio}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedCity} ({provider.serviceRadiusKm}km coverage)</span>
                </span>

                <div className="flex space-x-2">
                  <a
                    href={`tel:${provider.user?.phone}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold flex items-center space-x-1 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Phone className="w-3 h-3 text-emerald-500" />
                    <span>Call</span>
                  </a>
                  <button
                    onClick={() => setActiveChatProvider(provider.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>

              {/* Chat Box Drawer */}
              {activeChatProvider === provider.id && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-2 text-xs border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center font-bold text-slate-800 dark:text-slate-200">
                    <span>Chat with {provider.user?.profile?.firstName}</span>
                    <button onClick={() => setActiveChatProvider(null)} className="text-slate-400">
                      ✕
                    </button>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg text-slate-600 dark:text-slate-300">
                    Assalam-o-Alaikum! How can I help you with electrical or repair work today in {selectedCity}?
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type message in Urdu/English..."
                      className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <button
                      onClick={() => alert('Message sent via WhatsApp & SkillConnect Notification!')}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-lg font-bold"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
