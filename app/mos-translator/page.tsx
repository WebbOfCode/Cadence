"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getOnetCrosswalk, getCoolCerts, zipToStateMetro, getBlSalaries } from "@/lib/mosData";
import type { Branch } from "@/lib/mosData";

const TranslatorSchema = z.object({
  mos: z.string().min(2, "Enter your MOS/NEC/AFSC/Rating"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP"),
});

type TranslatorInputs = z.infer<typeof TranslatorSchema>;

export default function MOSTranslatorPage() {
  const [loading, setLoading] = useState(false);
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
    try {
      const translated = await translateWithProfiles(values.mos, values.zip);
      setResults(translated);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold">MOS → Civilian Job Translator</h1>
      <p className="text-sm text-gray-600 mt-1">
        Enter your MOS/NEC/AFSC/Rating and ZIP. Get real roles vets land, local salaries, skill gaps, cert pathways, and one-click resume bullets.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">MOS / NEC / AFSC / Rating</label>
          <input
            className="mt-1 w-full border-2 border-gray-200 rounded-md px-3 py-2"
            placeholder="e.g., 11B, 25B, IT-233, AE"
            {...register("mos")}
          />
          {errors.mos && (
            <p className="text-xs text-red-600 mt-1">{errors.mos.message}</p>
          )}
        </div>
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
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2 border-2 border-gray-200 rounded-md font-medium hover:border-black"
            disabled={loading}
          >
            {loading ? "Translating…" : "Translate"}
          </button>
        </div>
      </form>

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
            <h2 className="font-semibold">Average Salary in {" "}
              <span className="font-mono">{/* mask ZIP for privacy */}</span>
            </h2>
            <p className="text-xs text-gray-600 mb-2">Based on local market data.</p>
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

function getZipState(zip: string): string | null {
  const z = zip.slice(0, 5);
  const n = parseInt(z, 10);
  if (isNaN(n)) return null;
  // Minimal ZIP → state bands for demo accuracy on CA vs MS and common states
  // Source ranges (approx): USPS ZIP allocations; simplified for mock use
  if (n >= 90000 && n <= 96199) return 'CA';
  if (n >= 38600 && n <= 39799) return 'MS';
  if (n >= 85000 && n <= 86999) return 'AZ';
  if (n >= 10000 && n <= 14999) return 'NY';
  if (n >= 20000 && n <= 24999) return 'DC/VA';
  if (n >= 30000 && n <= 31999) return 'GA';
  if (n >= 32000 && n <= 34999) return 'FL';
  if (n >= 70000 && n <= 71599) return 'LA';
  if (n >= 77000 && n <= 78999) return 'TX';
  return null;
}

function costOfLivingMultiplier(state: string | null): number {
  // Very rough demo multipliers; replace with BLS/BEA regional price parity
  const table: Record<string, number> = {
    CA: 1.35,
    MS: 0.85,
    NY: 1.30,
    DC: 1.40,
    'DC/VA': 1.20,
    FL: 1.05,
    TX: 1.02,
    AZ: 1.00,
    GA: 0.98,
    LA: 0.95,
  };
  return state ? table[state] ?? 1.0 : 1.0;
}

async function translateWithProfiles(mos: string, zip: string) {
  const code = mos.trim().toUpperCase();
  const stateMetro = await zipToStateMetro(zip);
  const onet = await getOnetCrosswalk(code, inferBranchFromCode(code));

  // Category/level inference from MOS code prefix; expand as needed
  const catLevel = inferCategoryAndLevel(code);

  const jobTitles = pickTitles(catLevel.category, catLevel.level, code);

  let avgSalary: { title: string; amount: number; source: string }[] = [];
  if (stateMetro && onet.length > 0) {
    const wages = await getBlSalaries(onet[0], stateMetro.state, stateMetro.metro);
    const adj = levelMultiplier(catLevel.level);
    const amount = Math.round((wages?.median ?? baseByCategory(catLevel.category)) * adj);
    avgSalary = jobTitles.slice(0,3).map((title) => ({
      title,
      amount,
      source: `${onet[0]} • BLS${stateMetro.state ? ` (${stateMetro.state})` : ''}`,
    }));
  } else {
    const base = baseByCategory(catLevel.category);
    avgSalary = jobTitles.slice(0,3).map((title) => ({ title, amount: base, source: 'Est.' }));
  }

  const cool = await getCoolCerts(code, inferBranchFromCode(code));
  const skillGaps = suggestGaps(catLevel.category);
  const certPaths = mapCerts(skillGaps, cool);
  const resumeBullets = bulletsFor(catLevel.category, catLevel.level);

  return { jobTitles, avgSalary, skillGaps, certPaths, resumeBullets };
}

function inferBranchFromCode(code: string): Branch {
  if (/^[0-9]{2}[A-Z]/.test(code)) return 'army';
  return 'army';
}

function inferCategoryAndLevel(code: string): { category: 'it' | 'logistics' | 'medical' | 'combat_arms' | 'admin' | 'other'; level: 'entry' | 'mid' | 'senior' } {
  if (/^25/.test(code)) return { category: 'it', level: code.endsWith('B') ? 'mid' : 'entry' };
  if (/^92/.test(code) || /^88/.test(code)) return { category: 'logistics', level: 'mid' };
  if (/^68/.test(code)) return { category: 'medical', level: 'mid' };
  if (/^11/.test(code)) return { category: 'combat_arms', level: 'mid' };
  if (/^42/.test(code)) return { category: 'admin', level: 'mid' };
  return { category: 'other', level: 'entry' };
}

function pickTitles(category: string, level: 'entry' | 'mid' | 'senior', code?: string) {
  const map: Record<string, Record<string, string[]>> = {
    it: {
      entry: ["IT Support Specialist", "Help Desk Technician"],
      mid: ["Systems Administrator", "Network Administrator"],
      senior: ["IT Manager", "Infrastructure Lead"],
    },
    logistics: {
      entry: ["Logistics Clerk", "Inventory Specialist"],
      mid: ["Logistics Coordinator", "Operations Supervisor"],
      senior: ["Logistics Manager", "Distribution Manager"],
    },
    medical: {
      entry: ["Medical Assistant", "Patient Care Technician"],
      mid: ["Clinical Coordinator", "Health Services Specialist"],
      senior: ["Healthcare Operations Manager"],
    },
    combat_arms: {
      entry: ["Security Officer", "Public Safety Officer"],
      mid: ["Operations Supervisor", "Security Manager"],
      senior: ["Operations Manager"],
    },
    admin: {
      entry: ["Administrative Assistant", "HR Clerk"],
      mid: ["HR Specialist", "Office Manager"],
      senior: ["HR Manager"],
    },
    other: {
      entry: ["Project Coordinator", "Operations Assistant"],
      mid: ["Project Manager (Entry)", "Operations Supervisor"],
      senior: ["Operations Manager"],
    },
  };
  let titles = map[category]?.[level] ?? map.other.entry;
  // Refine with MOS-specific hints
  if (code?.startsWith('68')) titles = ["Medical Support Specialist", ...titles];
  if (code?.startsWith('92')) titles = ["Supply Specialist", ...titles];
  if (code?.startsWith('11')) titles = ["Security Supervisor", ...titles];
  return titles;
}

function baseByCategory(category: string) {
  switch (category) {
    case 'it': return 72000;
    case 'logistics': return 58000;
    case 'medical': return 62000;
    case 'admin': return 52000;
    case 'combat_arms': return 55000;
    default: return 56000;
  }
}

function levelMultiplier(level: 'entry' | 'mid' | 'senior') {
  return level === 'entry' ? 0.85 : level === 'mid' ? 1.0 : 1.2;
}

function suggestGaps(category: string): string[] {
  switch (category) {
    case 'it': return ["CompTIA A+", "CompTIA Security+", "Docker"];
    case 'logistics': return ["Excel Advanced", "Lean/Six Sigma Yellow Belt", "CAPM"];
    case 'medical': return ["EMT Basic", "Phlebotomy" ];
    case 'admin': return ["Excel Advanced", "HR Fundamentals" ];
    case 'combat_arms': return ["Security Management", "Incident Command ICS-100" ];
    default: return ["Excel Advanced", "CAPM" ];
  }
}

function mapCerts(gaps: string[], cool: any[]): { name: string; timeWeeks: number; costUSD: number; provider: string }[] {
  const catalog: Record<string, { timeWeeks: number; costUSD: number; provider: string }> = {
    "CompTIA A+": { timeWeeks: 4, costUSD: 246, provider: "CompTIA" },
    "CompTIA Security+": { timeWeeks: 6, costUSD: 370, provider: "CompTIA" },
    "Docker": { timeWeeks: 3, costUSD: 0, provider: "Self-study" },
    "Excel Advanced": { timeWeeks: 2, costUSD: 49, provider: "Online" },
    "Lean/Six Sigma Yellow Belt": { timeWeeks: 3, costUSD: 199, provider: "GoLeanSixSigma" },
    "CAPM": { timeWeeks: 6, costUSD: 300, provider: "PMI" },
    "EMT Basic": { timeWeeks: 8, costUSD: 1200, provider: "State EMS" },
    "Phlebotomy": { timeWeeks: 6, costUSD: 800, provider: "Vocational" },
    "HR Fundamentals": { timeWeeks: 3, costUSD: 99, provider: "Online" },
    "Security Management": { timeWeeks: 4, costUSD: 150, provider: "ASIS" },
    "Incident Command ICS-100": { timeWeeks: 1, costUSD: 0, provider: "FEMA" },
  };
  return gaps.map(g => ({ name: g, ...(catalog[g] ?? { timeWeeks: 2, costUSD: 50, provider: "Online" }) }));
}

function bulletsFor(category: string, level: 'entry' | 'mid' | 'senior') {
  if (category === 'it') {
    return [
      "Troubleshot and resolved Tier-1/2 incidents across 300+ endpoints, improving MTTR by 35%.",
      "Configured and maintained AD/OUs, group policies, and endpoint deployments for multiple units.",
      "Hardened networks via ACLs and routine patching; reduced critical CVEs by 60%.",
    ];
  }
  if (category === 'logistics') {
    return [
      "Managed inventory and logistics for 1,500+ line items; cut waste by 22%.",
      "Coordinated movement of personnel and cargo across multi-modal routes under tight timelines.",
      "Implemented process controls improving on-time deliveries to 98%.",
    ];
  }
  if (category === 'medical') {
    return [
      "Delivered patient care and medical support in austere environments while maintaining protocols.",
      "Managed medical supplies and documentation ensuring compliance and readiness.",
      "Assisted clinicians with triage and procedures; improved patient throughput.",
    ];
  }
  return [
    "Led a 12-person team executing time-critical missions; delivered 98% on-time completion.",
    "Managed operations and reporting, aligning schedules and resources across departments.",
    "Implemented SOPs and safety controls; reduced incidents by 30%.",
  ];
}
