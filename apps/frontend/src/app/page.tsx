'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  Droplets,
  Wind,
  Sun,
  Sparkles,
  GraduationCap,
  Hammer,
  Wrench,
  ArrowRight,
  MapPin,
  Star,
  CheckCircle2,
  BadgeCheck,
  Home,
  TrendingUp,
  Clock3,
  ChevronRight,
  Briefcase,
} from 'lucide-react';

const CATEGORIES = [
  { slug: 'electrical-wiring', name: 'Electrical & Wiring', icon: Zap, accent: 'from-amber-500/20 to-yellow-500/10', text: 'text-amber-600' },
  { slug: 'plumbing-pipework', name: 'Plumbing', icon: Droplets, accent: 'from-sky-500/20 to-cyan-500/10', text: 'text-sky-600' },
  { slug: 'ac-repair-servicing', name: 'AC Repair', icon: Wind, accent: 'from-cyan-500/20 to-emerald-500/10', text: 'text-cyan-600' },
  { slug: 'solar-inverter-setup', name: 'Solar Setup', icon: Sun, accent: 'from-orange-500/20 to-amber-500/10', text: 'text-orange-600' },
  { slug: 'home-cleaning', name: 'Home Cleaning', icon: Sparkles, accent: 'from-violet-500/20 to-fuchsia-500/10', text: 'text-violet-600' },
  { slug: 'home-tutors', name: 'Home Tutors', icon: GraduationCap, accent: 'from-indigo-500/20 to-blue-500/10', text: 'text-indigo-600' },
  { slug: 'carpentry-furniture', name: 'Carpentry', icon: Hammer, accent: 'from-amber-600/20 to-orange-500/10', text: 'text-amber-700' },
  { slug: 'auto-mechanic', name: 'Auto Mechanic', icon: Wrench, accent: 'from-rose-500/20 to-red-500/10', text: 'text-rose-600' },
];

const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];

const STATS = [
  { value: '24k+', label: 'verified bookings' },
  { value: '98%', label: 'satisfaction rate' },
  { value: '15 min', label: 'average response' },
];

const FEATURED_WORKERS = [
  { name: 'Ayesha Khan', role: 'Electrical Specialist', rating: '4.9', verified: true, location: 'Karachi', badge: 'Top Rated' },
  { name: 'Bilal Rafiq', role: 'Plumbing Expert', rating: '4.8', verified: true, location: 'Lahore', badge: 'Fast Response' },
  { name: 'Nadia Hussain', role: 'Home Tutor', rating: '5.0', verified: true, location: 'Islamabad', badge: 'Premium' },
];

const TESTIMONIALS = [
  { quote: 'The experience felt polished, transparent, and incredibly fast. I booked an AC service in minutes.', name: 'Farhan', title: 'Homeowner, Karachi' },
  { quote: 'Their provider quality is outstanding. Every booking felt premium and dependable.', name: 'Sana', title: 'Small Business Owner, Lahore' },
];

const STEPS = [
  { title: 'Tell us what you need', description: 'Choose a city, category, and preferred time in seconds.' },
  { title: 'Compare trusted providers', description: 'Review verified profiles, ratings, and transparent pricing.' },
  { title: 'Book with confidence', description: 'Secure payments and live updates keep every visit stress-free.' },
];

const Hero3D = dynamic(() => import('@/components/ThreeHero3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 sm:h-[400px] rounded-3xl bg-slate-950/80 border border-emerald-500/30 animate-pulse flex items-center justify-center text-slate-500 text-xs">
      Loading 3D Experience...
    </div>
  ),
});

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.25),transparent_30%),linear-gradient(135deg,_rgba(16,185,129,0.15),_transparent_55%),linear-gradient(125deg,_#07111f_0%,_#0c1728_45%,_#111827_100%)]" />
        <div className="absolute inset-0 hero-grid opacity-50" />
        <div className="orb left-[-4rem] top-24 h-48 w-48 bg-emerald-400/30" />
        <div className="orb right-[-2rem] top-10 h-64 w-64 bg-cyan-400/20" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.56 }} className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-200">
                <ShieldCheck className="h-4 w-4" />
                CNIC-verified service providers, premium experience
              </div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Discover trusted local experts in{' '}
                <span className="bg-gradient-to-r from-emerald-300 via-brand-400 to-cyan-300 bg-clip-text text-transparent">
                  Pakistan
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                From electricians to tutors, book premium home services with transparent pricing, verified professionals, and a delightfully polished experience.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/services" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100">
                  Browse services
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/register?role=PROVIDER" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">
                  Become a provider
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <MapPin className="h-4 w-4 text-emerald-300" />
                  Available across {CITIES.join(', ')}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Same-day booking options
                </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
              <Hero3D />
              <div className="mt-4 rounded-[1.5rem] border border-emerald-500/20 bg-gradient-to-r from-emerald-500/15 to-cyan-500/10 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-300">Trusted by 4,000+ homeowners</p>
                    <p className="mt-1 text-2xl font-semibold text-white">4.9/5 average rating</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <BadgeCheck className="h-6 w-6 text-emerald-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-6 w-[95%] max-w-6xl rounded-[2rem] border border-white/50 bg-white/70 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
        <div className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/70 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">Quick search</p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Find service professionals near you in seconds.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CITIES.slice(0, 4).map((city) => (
              <Link key={city} href={`/services?city=${city}`} className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-800 dark:text-slate-300">
                {city}
              </Link>
            ))}
          </div>
          <Link href="/services" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-500">
            Explore marketplace
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">Popular categories</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Everything you need, beautifully organized.</h2>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-brand-500 dark:text-slate-300">
              View all services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CATEGORIES.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.slug} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.04 }}>
                  <Link href={`/services?category=${cat.slug}`} className="group flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 transition hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.accent}`}>
                      <Icon className={`h-6 w-6 ${cat.text}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{cat.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Book vetted professionals for urgent repairs, upgrades, and everyday support.</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">Featured professionals</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Carefully curated experts you can trust.</h2>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {FEATURED_WORKERS.map((worker, index) => (
              <motion.article key={worker.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.35, delay: index * 0.05 }} className="group rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/70">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-emerald-500/10 text-lg font-semibold text-brand-600 dark:text-brand-300">
                    {worker.name.split(' ').map((part) => part[0]).join('')}
                  </div>
                  <span className="rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
                    {worker.badge}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">{worker.name}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{worker.role}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{worker.rating}</span>
                  <span className="text-slate-400">•</span>
                  <span>{worker.location}</span>
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <BadgeCheck className="h-4 w-4 text-emerald-500" />
                  <span>CNIC verified • 8+ years experience</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 p-8 text-white shadow-2xl shadow-slate-950/20 dark:border-slate-800">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Why SkillConnect</p>
                <h2 className="mt-3 text-3xl font-semibold">Premium service discovery, built for modern Pakistan.</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Our marketplace combines premium design, trusted professionals, and clear pricing to make local service booking feel effortless.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <p className="text-2xl font-semibold text-white">{stat.value}</p>
                      <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-500/15 p-3">
                    <Briefcase className="h-6 w-6 text-emerald-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Trusted by leading local businesses</p>
                    <p className="text-sm text-slate-300">From home repairs to professional services</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {['HomeFix', 'UrbanCare', 'SmartNest', 'BrightLine'].map((name) => (
                    <span key={name} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Elegant from first click to final booking.</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.06 }} className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/10 text-sm font-semibold text-brand-600 dark:text-brand-300">0{index + 1}</div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-2">
            {TESTIMONIALS.map((item) => (
              <div key={item.name} className="rounded-[2rem] border border-slate-200 bg-white/80 p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-lg leading-8 text-slate-700 dark:text-slate-300">“{item.quote}”</p>
                <div className="mt-5">
                  <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-brand-600 to-emerald-500 p-8 text-center text-white shadow-2xl shadow-brand-900/20">
            <h2 className="text-3xl font-semibold">Ready to experience a premium marketplace?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-brand-50">Join SkillConnect.pk to access trusted professionals, transparent pricing, and a polished booking experience.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/register" className="rounded-full bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50">Create free account</Link>
              <Link href="/login" className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10">Sign in</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/70 py-10 dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-600 dark:text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>SkillConnect.pk — premium local services for homes and businesses across Pakistan.</p>
          <div className="flex items-center gap-4">
            <Link href="/services" className="transition hover:text-brand-500">Services</Link>
            <Link href="/register?role=PROVIDER" className="transition hover:text-brand-500">Join as provider</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
