import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        The page you are looking for may have moved or no longer exists. Return to the home page to continue exploring services.
      </p>
      <Link href="/" className="mt-6 rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-brand-500">
        Go home
      </Link>
    </div>
  );
}
