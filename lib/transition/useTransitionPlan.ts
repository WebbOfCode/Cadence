'use client';

import { useEffect, useState } from 'react';
import type { TransitionPlan } from '@/lib/transition/schema';
import { useOnboardingStore } from '@/lib/useOnboardingStore';

export function useTransitionPlan(payload: any) {
  const [data, setData] = useState<TransitionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { transitionPlan, transitionPlanGeneratedAt, setTransitionPlan } = useOnboardingStore();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        // Check if we have a cached plan that's less than 1 hour old
        const cacheAge = transitionPlanGeneratedAt ? Date.now() - transitionPlanGeneratedAt : null;
        const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
        
        if (transitionPlan && cacheAge && cacheAge < CACHE_DURATION) {
          if (!cancelled) {
            setData(transitionPlan);
            setLoading(false);
          }
          return;
        }

        // Fetch fresh plan
        const res = await fetch('/api/transition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error ?? `Request failed (${res.status})`);
        }

        const json = (await res.json()) as TransitionPlan;
        if (!cancelled) {
          setData(json);
          setTransitionPlan(json);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Only call if we have enough to be meaningful
    if (payload?.profile?.branch && payload?.profile?.mos) {
      run();
    }

    return () => {
      cancelled = true;
    };
  }, [payload, transitionPlan, transitionPlanGeneratedAt, setTransitionPlan]);

  return { data, loading, error };
}
