'use client';

import Link from 'next/link';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-white/5 p-8 md:p-10">
        <p className="text-xs tracking-[0.2em] uppercase text-white/70 mb-3">Cadence Status</p>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">
          Hold Fast, Troop — Complete Onboarding First
        </h1>
        <p className="text-white/90 leading-relaxed mb-6">
          Your results screen is locked until onboarding is complete. Finish your onboarding steps so Cadence can build your mission plan and unlock your dashboard results.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-white text-black font-bold uppercase text-sm"
          >
            Complete Onboarding
          </Link>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-white/30 text-white font-bold uppercase text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    </main>
  );
}