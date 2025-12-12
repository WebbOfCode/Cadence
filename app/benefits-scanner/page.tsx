"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useOnboardingStore } from "@/lib/useOnboardingStore";

const QuestionnaireSchema = z.object({
  branch: z.enum(["Army","Navy","Air Force","Marine Corps","Coast Guard","Space Force"]),
  status: z.enum(["Separated","Retired","Active"]),
  separationType: z.enum(["honorable","general","other-than-honorable"]).optional(),
  dischargeCode: z.string().max(10).optional(),
  disabilityRating: z.enum(["none","pending","0-20%","30-60%","70-100%"]),
  deployed: z.enum(["no","yes-nonhazard","yes-hazardous"]).optional(),
  state: z.string().min(2),
  county: z.string().min(2),
  educationLevel: z.enum(["high-school","some-college","bachelor","master"]),
  employmentStatus: z.enum(["unemployed","full-time","part-time","disabled"]),
  optional: z.object({
    combatDecorations: z.boolean().default(false),
    purpleHeart: z.boolean().default(false),
    dependents: z.boolean().default(false),
    spouseVeteran: z.boolean().default(false),
    homeowner: z.boolean().default(false),
  }).optional(),
});

type Questionnaire = z.infer<typeof QuestionnaireSchema>;

type Benefit = {
  id: string;
  category: "education" | "housing" | "finance" | "career" | "health" | "cash" | "other";
  title: string;
  whyQualified: string;
  impactUSD?: number;
  complexity: "easy" | "moderate" | "heavy";
  timeToApply: string;
  approvalETA?: string;
  docs: string[];
  links: { label: string; url: string }[];
};

export default function BenefitsScannerPage() {
  const preset = useOnboardingStore((s) => s.data);
  const { updateData } = useOnboardingStore();

  const [results, setResults] = useState<Benefit[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalValue, setTotalValue] = useState(0);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<Questionnaire>({
    resolver: zodResolver(QuestionnaireSchema),
    defaultValues: {
      branch: (preset.branch as Questionnaire["branch"]) || "Army",
      status: "Separated",
      separationType: (preset.dischargeType as Questionnaire["separationType"]) || "honorable",
      dischargeCode: preset.dischargeCode || undefined,
      disabilityRating: "none",
      deployed: "no",
      state: "TN",
      county: "Davidson",
      educationLevel: "some-college",
      employmentStatus: "unemployed",
    },
  });

  const onSubmit = async (q: Questionnaire) => {
    setLoading(true);
    setError(null);
    
    // Persist selected branch into onboarding store for theming synergy
    updateData({ branch: q.branch });

    try {
      const response = await fetch('/api/scan-benefits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(q),
      });

      if (!response.ok) {
        throw new Error('Failed to scan benefits');
      }

      const data = await response.json();
      setResults(data.benefits);
      setTotalValue(data.totalValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error scanning benefits:', err);
    } finally {
      setLoading(false);
    }
  };

  const [reminders, setReminders] = useState<{ id: string; when: string }[]>([]);

  function saveBenefit(id: string) {
    setSavedIds((prev) => prev.includes(id) ? prev : [...prev, id]);
  }
  function setReminder(id: string, when: string) {
    setReminders((prev) => [...prev.filter(r => r.id !== id), { id, when }]);
    alert(`Reminder set for ${id} at ${when}`);
  }
  async function exportPDF() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Your Personalized Benefits Report", 10, 10);
    let y = 20;
    results.forEach((b, i) => {
      doc.setFontSize(12);
      doc.text(`${i+1}. ${b.title} — Impact: $${(b.impactUSD ?? 0).toLocaleString()}`, 10, y);
      y += 6;
      doc.setFontSize(10);
      doc.text(`Why: ${b.whyQualified}`, 10, y);
      y += 5;
      doc.text(`Docs: ${b.docs.join(", ")}`, 10, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save("benefits-report.pdf");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-xl md:text-2xl font-bold">Veteran Benefits Scanner</h1>
      <p className="text-xs md:text-sm text-gray-600 mt-1">Answer ~10 smart questions. We rank federal, state, county, and nonprofit benefits you qualify for — with impact and steps.</p>

      {/* Questionnaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <section className="p-4 border-2 border-gray-200 rounded-lg">
          <h2 className="font-semibold mb-3">Core Inputs</h2>
          {/* Branch */}
          <label className="text-sm font-medium">Branch of Service</label>
          <select className="mt-1 w-full border-2 rounded-md px-3 py-2" {...register("branch")}>
            {(["Army","Navy","Air Force","Marine Corps","Coast Guard","Space Force"] as const).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Status */}
          <label className="text-sm font-medium mt-4 block">Separated, Retired, or Active?</label>
          <select className="mt-1 w-full border-2 rounded-md px-3 py-2" {...register("status")}>
            {(["Separated","Retired","Active"] as const).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Separation Type */}
          <label className="text-sm font-medium mt-4 block">Type of Separation</label>
          <select className="mt-1 w-full border-2 rounded-md px-3 py-2" {...register("separationType")}>
            {(["honorable","general","other-than-honorable"] as const).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {/* Optional Discharge Code (appears when not honorable) */}
          {watch("separationType") && watch("separationType") !== "honorable" && (
            <div className="mt-2">
              <label className="text-sm font-medium">Optional Discharge Code</label>
              <input
                className="mt-1 w-full border-2 border-gray-200 rounded-md px-3 py-2"
                placeholder="e.g., RE-3, JKA"
                {...register("dischargeCode")}
              />
              <p className="text-xs text-gray-600 mt-1">
                Optional: helps fine-tune eligibility and prioritize accessible benefits.
              </p>
            </div>
          )}

          {/* Disability Rating */}
          <label className="text-sm font-medium mt-4 block">Disability Rating</label>
          <select className="mt-1 w-full border-2 rounded-md px-3 py-2" {...register("disabilityRating")}>
            {(["none","pending","0-20%","30-60%","70-100%"] as const).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Deployed */}
          <label className="text-sm font-medium mt-4 block">Were you deployed?</label>
          <select className="mt-1 w-full border-2 rounded-md px-3 py-2" {...register("deployed")}>
            {(["no","yes-nonhazard","yes-hazardous"] as const).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </section>

        <section className="p-4 border-2 border-gray-200 rounded-lg">
          <h2 className="font-semibold mb-3">Location, Education, Employment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">State</label>
              <input className="mt-1 w-full border-2 rounded-md px-3 py-2" placeholder="e.g., TN" {...register("state")} />
            </div>
            <div>
              <label className="text-sm font-medium">County</label>
              <input className="mt-1 w-full border-2 rounded-md px-3 py-2" placeholder="e.g., Davidson" {...register("county")} />
            </div>
          </div>

          <label className="text-sm font-medium mt-4 block">Education Level</label>
          <select className="mt-1 w-full border-2 rounded-md px-3 py-2" {...register("educationLevel")}>
            {(["high-school","some-college","bachelor","master"] as const).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <label className="text-sm font-medium mt-4 block">Employment Status</label>
          <select className="mt-1 w-full border-2 rounded-md px-3 py-2" {...register("employmentStatus")}>
            {(["unemployed","full-time","part-time","disabled"] as const).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {(
              [
                { key: "combatDecorations", label: "Combat decorations?" },
                { key: "purpleHeart", label: "Purple Heart?" },
                { key: "dependents", label: "Any dependents?" },
                { key: "spouseVeteran", label: "Spouse a veteran too?" },
                { key: "homeowner", label: "Homeowner or renter?" },
              ] as const
            ).map((opt) => (
              <label key={opt.key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register((`optional.${opt.key}`) as `optional.${typeof opt.key}`)} />
                {opt.label}
              </label>
            ))}
          </div>
        </section>

        <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-md font-medium hover:border-black disabled:opacity-50"
          >
            {loading ? 'Scanning...' : 'Scan Benefits'}
          </button>
          <button type="button" onClick={exportPDF} className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-md font-medium hover:border-black">Export PDF</button>
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div className="mt-6 p-4 border-2 border-red-200 rounded-lg bg-red-50">
          <p className="text-sm text-red-800">Error: {error}</p>
        </div>
      )}

      {/* Results Dashboard */}
      {results.length > 0 && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Benefits (Ranked by Impact)</h2>
            <p className="text-sm text-gray-600">Saved: {savedIds.length}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
            {results.map((b) => (
              <section key={b.id} className="p-4 border-2 border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{b.title}</h3>
                    {b.impactUSD !== undefined && (
                      <p className="text-sm text-gray-700">Estimated value: ${b.impactUSD.toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs px-2 py-1 border rounded" onClick={() => saveBenefit(b.id)}>Save</button>
                    <button className="text-xs px-2 py-1 border rounded" onClick={() => setReminder(b.id, new Date(Date.now()+7*86400000).toISOString().slice(0,10))}>Remind in 7d</button>
                  </div>
                </div>

                <p className="text-sm mt-1">Why you qualify: {b.whyQualified}</p>
                <p className="text-xs text-gray-600">Complexity: {b.complexity} • Time to apply: {b.timeToApply} • Approval: {b.approvalETA ?? "Varies"}</p>

                <div className="mt-2">
                  <p className="text-sm font-medium">Required documents</p>
                  <ul className="text-sm list-disc ml-5">
                    {b.docs.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {b.links.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 border rounded hover:bg-gray-50">
                      {l.label}
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Killer Feature: Money on the Table */}
          <section className="p-4 border-2 border-gray-200 rounded-lg">
            <h3 className="font-semibold">How Much Money Am I Leaving on the Table?</h3>
            <p className="text-sm text-gray-600 mb-2">Estimated annual savings/earnings based on eligible benefits.</p>
            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
          </section>
        </div>
      )}
    </div>
  );
}
