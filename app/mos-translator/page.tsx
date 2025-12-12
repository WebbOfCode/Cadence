"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const TranslatorSchema = z.object({
  mos: z.string().min(2, "Enter your MOS/NEC/AFSC/Rating"),
  secondaryMos: z.string().optional(),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP"),
});

type TranslatorInputs = z.infer<typeof TranslatorSchema>;

export default function MOSTranslatorPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState<string>("");
  const [results, setResults] = useState<null | {
    jobTitles: string[];
    avgSalary: { title: string; amount: number; source: string }[];
    skillGaps: string[];
    certPaths: { name: string; timeWeeks: number; costUSD: number; provider: string }[];
    resumeBullets: string[];
  }>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TranslatorInputs>({ resolver: zodResolver(TranslatorSchema) });
  async function onSubmit(values: TranslatorInputs) {
    setLoading(true);
    setError(null);
    setZipCode(values.zip);
    try {
      const mosToAnalyze = values.secondaryMos 
        ? `${values.mos} (Primary), ${values.secondaryMos} (Secondary)`
        : values.mos;

      const response = await fetch('/api/translate-mos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mos: mosToAnalyze,
          zip: values.zip,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to translate MOS');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Error translating MOS:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold">MOS Translator</h1>
      <p className="text-xs md:text-sm text-gray-600 mt-1">Discover career paths, salaries, certifications, and resume bullets for your MOS</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Primary MOS / NEC / AFSC / Rating</label>
            <input
              className="mt-1 w-full border-2 border-gray-200 rounded-md px-3 py-2"
              placeholder="e.g., 11B, 25B, IT, AE"
              {...register("mos")}
            />
            {errors.mos && (
              <p className="text-xs text-red-600 mt-1">{errors.mos.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Secondary MOS (Optional)</label>
            <input
              className="mt-1 w-full border-2 border-gray-200 rounded-md px-3 py-2"
              placeholder="e.g., 68W (if you have dual MOS)"
              {...register("secondaryMos")}
            />
            <p className="text-xs text-gray-500 mt-1">Add if you hold multiple MOS designations</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="text-sm font-medium">ZIP Code</label>
            <input
              className="mt-1 w-full border-2 border-gray-200 rounded-md px-3 py-2"
              placeholder="e.g., 90210"
              {...register("zip")}
            />
            {errors.zip && (
              <p className="text-xs text-red-600 mt-1">{errors.zip.message}</p>
            )}
          </div>
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-md font-medium hover:border-black disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Translating…" : "Translate"}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {loading && (
        <div className="mt-6 p-4 border-2 border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">Generating personalized career insights with AI...</p>
        </div>
      )}

      {results && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Real job titles */}
          <section className="p-3 md:p-4 border-2 border-gray-200 rounded-lg">
            <h2 className="text-sm md:text-base font-semibold">Real Job Titles</h2>
            <p className="text-xs text-gray-600 mb-2">Roles veterans with this MOS actually get hired for.</p>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              {results.jobTitles.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>

          {/* Local salaries */}
          <section className="p-3 md:p-4 border-2 border-gray-200 rounded-lg">
            <h2 className="text-sm md:text-base font-semibold">Average Salary in {zipCode}</h2>
            <p className="text-xs text-gray-600 mb-2">Based on local market data.</p>
            <ul className="space-y-2">
              {results.avgSalary.map((s) => (
                <li key={s.title} className="flex items-center justify-between text-sm">
                  <span>{s.title}</span>
                  <span className="font-mono text-xs md:text-sm">${s.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-2">Sources: {results.avgSalary.map(s => s.source).join(", ")}</p>
          </section>

          {/* Skills gaps */}
          <section className="p-3 md:p-4 border-2 border-gray-200 rounded-lg">
            <h2 className="text-sm md:text-base font-semibold">Skills Gaps</h2>
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
          <section className="p-3 md:p-4 border-2 border-gray-200 rounded-lg">
            <h2 className="text-sm md:text-base font-semibold">Cert Pathways</h2>
            <p className="text-xs text-gray-600 mb-2">Time, cost, and providers mapped out.</p>
            <ul className="space-y-2">
              {results.certPaths.map((c) => (
                <li key={c.name} className="border rounded p-2 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-sm">{c.name}</p>
                    <p className="text-xs text-gray-600">Provider: {c.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs md:text-sm">{c.timeWeeks} weeks</p>
                    <p className="text-xs md:text-sm font-mono">${c.costUSD.toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* One-click resume bullets */}
          <section className="p-3 md:p-4 border-2 border-gray-200 rounded-lg md:col-span-2 lg:col-span-2">
            <h2 className="text-sm md:text-base font-semibold">One-Click Resume Bullets</h2>
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
