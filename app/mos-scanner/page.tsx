"use client";

import { useState, useEffect } from "react";
import { useOnboardingStore } from "@/lib/useOnboardingStore";

export default function MOSScannerPage() {
  const preset = useOnboardingStore((s) => s.data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<null | {
    jobTitles: string[];
    avgSalary: { title: string; amount: number; source: string }[];
    skillGaps: string[];
    certPaths: { name: string; timeWeeks: number; costUSD: number; provider: string }[];
    resumeBullets: string[];
  }>(null);

  // Auto-run on mount if we have MOS + ZIP from onboarding
  useEffect(() => {
    if (preset.mos && preset.location) {
      handleScan();
    }
  }, []);

  async function handleScan() {
    if (!preset.mos || !preset.location) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/translate-mos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mos: preset.mos,
          zip: preset.location,
          branch: preset.branch,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate career insights');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Error scanning MOS:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold">MOS Career Scanner</h1>
      <p className="text-sm text-gray-600 mt-1">
        Using your onboarding data to generate personalized civilian career pathways.
      </p>

      {/* Show preset values */}
      <div className="mt-6 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
        <h2 className="font-semibold mb-2">Your Profile</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Branch:</span> {preset.branch ?? "—"}
          </div>
          <div>
            <span className="font-medium">MOS:</span> {preset.mos ?? "—"}
          </div>
          <div>
            <span className="font-medium">ZIP:</span> {preset.location ?? "—"}
          </div>
          <div>
            <span className="font-medium">Goal:</span> {preset.goal ?? "—"}
          </div>
        </div>
        {(!preset.mos || !preset.location) && (
          <p className="text-xs text-yellow-700 mt-2">
            Complete onboarding to populate MOS and ZIP for automatic scanning.
          </p>
        )}
        {preset.mos && preset.location && !results && !loading && (
          <button
            onClick={handleScan}
            disabled={loading}
            className="mt-3 px-4 py-2 border-2 border-gray-200 rounded-md font-medium hover:border-black"
          >
            Scan Now
          </button>
        )}
        {loading && (
          <p className="text-sm text-gray-600 mt-2">Generating personalized career insights with AI...</p>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {results && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Real job titles */}
          <section className="p-4 border-2 border-gray-200 rounded-lg">
            <h2 className="font-semibold">Real Job Titles</h2>
            <p className="text-xs text-gray-600 mb-2">Roles veterans with this MOS actually get hired for.</p>
            <ul className="list-disc ml-5 space-y-1">
              {results.jobTitles.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>

          {/* Local salaries */}
          <section className="p-4 border-2 border-gray-200 rounded-lg">
            <h2 className="font-semibold">Average Salary in Your Area</h2>
            <p className="text-xs text-gray-600 mb-2">Based on local market data for ZIP {preset.location}.</p>
            <ul className="space-y-2">
              {results.avgSalary.map((s) => (
                <li key={s.title} className="flex items-center justify-between">
                  <span>{s.title}</span>
                  <span className="font-mono">${s.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-2">Sources: {results.avgSalary.map(s => s.source).join(", ")}</p>
          </section>

          {/* Skills gaps */}
          <section className="p-4 border-2 border-gray-200 rounded-lg">
            <h2 className="font-semibold">Skills Gaps</h2>
            <p className="text-xs text-gray-600 mb-2">You may be missing these industry credentials or skills.</p>
            <div className="flex flex-wrap gap-2">
              {results.skillGaps.map((g) => (
                <span key={g} className="text-xs px-2 py-1 rounded border bg-yellow-50 text-yellow-900 border-yellow-300">
                  {g}
                </span>
              ))}
            </div>
          </section>

          {/* Cert pathways */}
          <section className="p-4 border-2 border-gray-200 rounded-lg">
            <h2 className="font-semibold">Cert Pathways</h2>
            <p className="text-xs text-gray-600 mb-2">Time, cost, and providers mapped out.</p>
            <ul className="space-y-2">
              {results.certPaths.map((c) => (
                <li key={c.name} className="border rounded p-2 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-gray-600">Provider: {c.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{c.timeWeeks} weeks</p>
                    <p className="text-sm font-mono">${c.costUSD.toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* One-click resume bullets */}
          <section className="p-4 border-2 border-gray-200 rounded-lg lg:col-span-2">
            <h2 className="font-semibold">One-Click Resume Bullets</h2>
            <p className="text-xs text-gray-600 mb-2">Translated from military → civilian terminology.</p>
            <ul className="space-y-2">
              {results.resumeBullets.map((b, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{b}</span>
                  <button
                    className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                    onClick={() => navigator.clipboard.writeText(b)}
                  >
                    Copy
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
