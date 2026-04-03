'use client';

import Link from 'next/link';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
        <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-3">Cadence Error</p>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 text-black">
          Something went wrong
        </h1>
        <p className="text-gray-700 leading-relaxed mb-6">
          An unexpected error occurred while loading this page. You can retry or go back to the home page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-black text-white font-bold uppercase text-sm"
          >
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-gray-300 text-black font-bold uppercase text-sm"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}