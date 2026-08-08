'use client';

import { useState } from 'react';
import { MessageSquareQuote, Star } from 'lucide-react';

const reviews = [
  {
    author: 'Sana Mir',
    rating: 5,
    text: 'The provider was punctual, tidy, and explained the work clearly.',
  },
  {
    author: 'Farooq Hussain',
    rating: 4,
    text: 'Competitive pricing and a smooth booking experience from start to finish.',
  },
  {
    author: 'Maira Khan',
    rating: 5,
    text: 'Highly professional and dependable for recurring household maintenance.',
  },
];

export default function ReviewsPage() {
  const [selectedRating, setSelectedRating] = useState(0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reviews</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">See what customers say about verified providers and services on SkillConnect.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          4.8 average rating • 240 reviews
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
            <MessageSquareQuote className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Leave a review</h2>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Rate your recent booking and help other customers discover great providers.</p>
          <div className="mt-5 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedRating(value)}
                className="rounded-full p-2 text-slate-400 transition-colors hover:text-yellow-500"
                aria-label={`Rate ${value} stars`}
              >
                <Star className={`h-5 w-5 ${value <= selectedRating ? 'fill-yellow-500 text-yellow-500' : ''}`} />
              </button>
            ))}
          </div>
          <textarea
            rows={4}
            placeholder="Share your experience with the provider"
            className="mt-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button className="mt-4 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500">
            Submit review
          </button>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <article key={review.author} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900 dark:text-white">{review.author}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{review.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
