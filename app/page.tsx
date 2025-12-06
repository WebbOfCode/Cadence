'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/useOnboardingStore';

export default function HomePage() {
  const router = useRouter();
  const { data, missionPlan } = useOnboardingStore();

  useEffect(() => {
    if (missionPlan) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  }, [missionPlan, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight mb-4">Cadence</h1>
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
