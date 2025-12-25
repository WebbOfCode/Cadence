"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useOnboardingStore } from "@/lib/useOnboardingStore";
import type { MissionTask } from "@/lib/types";

const QuestionnaireSchema = z.object({
  branch: z.enum(["Army","Navy","Air Force","Marine Corps","Coast Guard","Space Force"]),
  status: z.enum(["Separated","Retired","Active"]),
  separationType: z.enum(["honorable","general","other-than-honorable","entry-level","bad-conduct","dishonorable"]).optional(),
  dischargeCode: z.string().max(10).optional(),
  disabilityRating: z.enum(["none","pending","0-20%","30-60%","70-100%"]),
  deployed: z.enum(["no","yes-nonhazard","yes-hazardous"]).optional(),
  state: z.string().min(2),
  county: z.string().min(2),
  educationLevel: z.enum(["high-school","some-college","bachelor","master"]),
  employmentStatus: z.enum(["unemployed","full-time","part-time","disabled"]),
  personalDetails: z.object({
    dependents: z.string().optional(),
    spouseVeteran: z.string().optional(),
    purpleHeart: z.string().optional(),
    combatDecorations: z.string().optional(),
    homeowner: z.string().optional(),
    specificNeeds: z.string().optional(),
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
  const [showPreview, setShowPreview] = useState(!results.length);

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
      personalDetails: {
        dependents: "",
        spouseVeteran: "",
        purpleHeart: "",
        combatDecorations: "",
        homeowner: "",
        specificNeeds: "",
      },
    },
  });

  const onSubmit = async (q: Questionnaire) => {
    setLoading(true);
    setError(null);
    setShowPreview(false);
    
    // Persist selected branch and discharge type into onboarding store
    updateData({ 
      branch: q.branch,
      dischargeType: q.separationType as any,
      dischargeCode: q.dischargeCode,
      disabilityClaim: q.disabilityRating !== 'none',
    });

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
      
      // Inject NCO guidance recommendations as high-priority "benefits"
      const ncoRecommendations: Benefit[] = [];
      
      // Discharge upgrade recommendation
      if (q.separationType && q.separationType !== 'honorable') {
        ncoRecommendations.push({
          id: 'nco-discharge-upgrade',
          category: 'other',
          title: '⭐ NCO Guidance: File Discharge Upgrade Request',
          whyQualified: 'Non-honorable discharge detected. Upgrades are common, low-risk, and unlock VA healthcare, education, home loans, and hiring preferences.',
          impactUSD: 0,
          complexity: 'moderate',
          timeToApply: '3–6 months',
          approvalETA: 'Varies',
          docs: ['DD-214', 'Service records', 'Personal statement', 'New evidence (medical, character references)'],
          links: [
            { label: 'DD Form 293', url: 'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0293.pdf' },
            { label: 'DD Form 149', url: 'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0149.pdf' },
            { label: 'DAV Office', url: 'https://www.dav.org/find-your-local-dav-office/' },
          ],
        });
      }
      
      // Disability claim recommendation
      if (q.disabilityRating === 'none') {
        ncoRecommendations.push({
          id: 'nco-disability-claim',
          category: 'finance',
          title: '⭐ NCO Guidance: File Initial VA Disability Claim',
          whyQualified: 'No disability rating detected. Filing is common, low-risk, and can unlock tax exemptions, healthcare priority, and monthly compensation.',
          impactUSD: 0,
          complexity: 'moderate',
          timeToApply: '1–3 months',
          approvalETA: '3–6 months',
          docs: ['DD-214', 'Medical records', 'Service treatment records'],
          links: [
            { label: 'File on VA.gov', url: 'https://www.va.gov/disability/how-to-file-claim/' },
            { label: 'DAV Help', url: 'https://www.dav.org/' },
          ],
        });
      }
      
      setResults([...ncoRecommendations, ...data.benefits]);
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
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Benefits Finder</span>
          {results.length > 0 && (
            <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">Complete</span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Veteran Benefits Scanner</h1>
        <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
          Answer a few questions to uncover benefits you may be missing — including education, housing, tax breaks, healthcare, and cash assistance from federal, state, and local programs.
        </p>
      </div>

      {/* Main Content */}
      {results.length === 0 ? (
        <div className="space-y-8">
          {/* Preview Section */}
          {showPreview && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">What You'll Discover</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-xl flex-shrink-0">📊</span>
                  <span className="text-sm text-blue-900"><strong>Ranked benefits by impact</strong> — we prioritize high-value opportunities first</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl flex-shrink-0">💵</span>
                  <span className="text-sm text-blue-900"><strong>Estimated money and savings</strong> — see exactly what each benefit is worth</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl flex-shrink-0">🔗</span>
                  <span className="text-sm text-blue-900"><strong>Direct application links</strong> — one-click access to apply</span>
                </li>
              </ul>
            </div>
          )}

          {/* Form Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Military Service Basics */}
            <fieldset className="border-l-4 border-gray-900 pl-6 space-y-5">
              <div>
                <legend className="text-lg font-semibold text-gray-900 mb-1">Military Service Basics</legend>
                <p className="text-sm text-gray-600">Help us understand your service background.</p>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Branch of Service</label>
                <select className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors" {...register("branch")}>
                  {(["Army","Navy","Air Force","Marine Corps","Coast Guard","Space Force"] as const).map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Current Status</label>
                <select className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors" {...register("status")}>
                  {(["Separated","Retired","Active"] as const).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </fieldset>

            {/* Section 2: Discharge & Eligibility */}
            <fieldset className="border-l-4 border-orange-500 pl-6 space-y-5">
              <div>
                <legend className="text-lg font-semibold text-gray-900 mb-1">⚖️ Discharge & Eligibility</legend>
                <p className="text-sm text-gray-600">Discharge type and disability rating unlock specific benefits and tax exemptions.</p>
              </div>

              {/* Separation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Type of Discharge</label>
                <select className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors" {...register("separationType")}>
                  {(["honorable","general","other-than-honorable","entry-level","bad-conduct","dishonorable"] as const).map(s => (
                    <option key={s} value={s}>{s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">Some benefits require Honorable or General (Under Honorable) discharge. Others are available regardless.</p>
              </div>

              {/* Behavioral UX: Discharge Upgrade Recommendation */}
              {watch("separationType") && watch("separationType") !== "honorable" && (
                <div className="mt-4 p-6 border-2 border-amber-300 bg-amber-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">NCO Guidance: Try a Discharge Upgrade</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    A lot of veterans assume their discharge is the end of the story. It isn’t. Discharge upgrades are <strong>common</strong>, <strong>legal</strong>, and applying <strong>does not</strong> reduce your current benefits, impact your VA claims, or create penalties if denied.
                  </p>
                  <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1 mb-3">
                    <li>Why it matters: unlocks VA healthcare, education, home loans, hiring preferences</li>
                    <li>Many succeed years after separation with new evidence or inequities</li>
                    <li>There’s <strong>no downside</strong> to applying</li>
                  </ul>
                  <div className="mt-4 p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900">Next Recommended Action</p>
                    <p className="text-sm text-gray-700">File Discharge Upgrade Request</p>
                    <p className="text-xs text-gray-600">Difficulty: Medium • Estimated time: 3–6 months</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a className="text-xs px-3 py-2 border-2 border-gray-300 rounded hover:border-gray-400" href="https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0293.pdf" target="_blank" rel="noreferrer">DD Form 293</a>
                      <a className="text-xs px-3 py-2 border-2 border-gray-300 rounded hover:border-gray-400" href="https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0149.pdf" target="_blank" rel="noreferrer">DD Form 149</a>
                      <a className="text-xs px-3 py-2 border-2 border-gray-300 rounded hover:border-gray-400" href="https://www.dav.org/find-your-local-dav-office/" target="_blank" rel="noreferrer">DAV</a>
                      <a className="text-xs px-3 py-2 border-2 border-gray-300 rounded hover:border-gray-400" href="https://www.legion.org/" target="_blank" rel="noreferrer">American Legion</a>
                      <a className="text-xs px-3 py-2 border-2 border-gray-300 rounded hover:border-gray-400" href="https://www.vfw.org/" target="_blank" rel="noreferrer">VFW</a>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <AddUpgradeTaskButton separationType={watch("separationType") || "general"} />
                    </div>
                    <p className="text-xs text-gray-500 mt-3">Cadence provides guidance, not legal advice. No guarantees or promises of approval.</p>
                  </div>
                </div>
              )}

              {/* Optional Discharge Code */}
              {watch("separationType") && watch("separationType") !== "honorable" && (
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Discharge Code <span className="text-xs font-normal text-gray-500">(optional)</span>
                  </label>
                  <input
                    className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="e.g., RE-3, JKA"
                    {...register("dischargeCode")}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Helps us fine-tune eligibility and identify discharge upgrade paths if needed.
                  </p>
                </div>
              )}

              {/* Disability Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">VA Disability Rating</label>
                <select className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors" {...register("disabilityRating")}>
                  {(["none","pending","0-20%","30-60%","70-100%"] as const).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <p className="text-xs text-gray-500 mt-2">Used to unlock tax exemptions, healthcare priority, education benefits, and state programs.</p>
              </div>
            </fieldset>

            {/* Section 3: Service Details */}
            <fieldset className="border-l-4 border-blue-500 pl-6 space-y-5">
              <div>
                <legend className="text-lg font-semibold text-gray-900 mb-1">🎖️ Service Details</legend>
                <p className="text-sm text-gray-600">Combat and deployment history trigger presumptive conditions and state bonuses.</p>
              </div>

              {/* Deployed */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Deployment History</label>
                <select className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors" {...register("deployed")}>
                  {(["no","yes-nonhazard","yes-hazardous"] as const).map(s => (
                    <option key={s} value={s}>
                      {s === "no" ? "No deployment" : s === "yes-nonhazard" ? "Yes, non-combat zone" : "Yes, combat zone"}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">Combat deployments unlock presumptive conditions for VA healthcare and state veteran programs.</p>
              </div>
            </fieldset>

            {/* Section 4: Current Circumstances */}
            <fieldset className="border-l-4 border-green-600 pl-6 space-y-5">
              <div>
                <legend className="text-lg font-semibold text-gray-900 mb-1">🏡 Your Circumstances</legend>
                <p className="text-sm text-gray-600">Location, education, and employment determine local and state benefits.</p>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">State</label>
                  <input className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors" placeholder="e.g., TX, CA, NY" {...register("state")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">County</label>
                  <input className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors" placeholder="e.g., Travis, Kings" {...register("county")} />
                </div>
              </div>

              {/* Education & Employment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Education Level</label>
                  <select className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors" {...register("educationLevel")}>
                    {(["high-school","some-college","bachelor","master"] as const).map(s => (
                      <option key={s} value={s}>{s.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Employment Status</label>
                  <select className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors" {...register("employmentStatus")}>
                    {(["unemployed","full-time","part-time","disabled"] as const).map(s => (
                      <option key={s} value={s}>{s.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Section 5: Household & Service Factors */}
            <fieldset className="border-l-4 border-purple-500 pl-6 space-y-5">
              <div>
                <legend className="text-lg font-semibold text-gray-900 mb-1">👨‍👩‍👧 Household & Service Factors</legend>
                <p className="text-sm text-gray-600">These unlock additional support and recognition-based benefits.</p>
              </div>

              <div className="space-y-4">
                {(
                  [
                    { key: "dependents", label: "Dependents", placeholder: "e.g., 2 children, spouse" },
                    { key: "spouseVeteran", label: "Spouse Veteran Status", placeholder: "e.g., Army veteran 2010-2018" },
                    { key: "purpleHeart", label: "Purple Heart Details", placeholder: "e.g., Received 2015, Afghanistan" },
                    { key: "combatDecorations", label: "Combat Decorations", placeholder: "e.g., Bronze Star, Combat Infantry Badge" },
                    { key: "homeowner", label: "Homeownership Status", placeholder: "e.g., Own home with mortgage" },
                  ] as const
                ).map((opt) => (
                  <div key={opt.key}>
                    <label className="block text-sm font-medium text-gray-900 mb-2">{opt.label}</label>
                    <input
                      type="text"
                      {...register(`personalDetails.${opt.key}` as `personalDetails.${typeof opt.key}`)}
                      placeholder={opt.placeholder}
                      className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                ))}
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Specific Needs or Goals</label>
                  <textarea
                    {...register("personalDetails.specificNeeds")}
                    placeholder="Tell us about your specific situation, challenges, or goals (e.g., 'Looking for IT training', 'Need wheelchair accessible housing', 'Interested in starting a business')"
                    rows={3}
                    className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-2">This helps us find benefits and resources tailored to your unique situation.</p>
                </div>
              </div>
            </fieldset>

            {/* Submit Section */}
            <div className="border-t-2 border-gray-200 pt-8 space-y-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full px-6 py-3 md:py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-base md:text-lg"
              >
                {loading ? 'Scanning Benefits...' : 'Find My Benefits'}
              </button>

              {/* Trust Note */}
              <p className="text-xs text-gray-500 text-center">
                🔒 We don't store sensitive information. This scan is informational and not legal advice. <a href="#" className="text-gray-700 hover:underline">Privacy Policy</a>
              </p>

              {/* Secondary Action */}
              {results.length > 0 && (
                <button 
                  type="button" 
                  onClick={exportPDF}
                  className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors"
                >
                  Download My Results
                </button>
              )}
            </div>
          </form>

          {/* Error State */}
          {error && (
            <div className="mt-8 p-6 border-2 border-red-200 rounded-lg bg-red-50">
              <p className="text-sm font-medium text-red-900">⚠️ {error}</p>
              <p className="text-xs text-red-700 mt-2">Try reviewing your inputs or contact support.</p>
            </div>
          )}
        </div>
      ) : (
        // Results View
        <div className="space-y-8">
          {/* Impact Summary */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-300 mb-2">Total Opportunity</p>
            <p className="text-4xl md:text-5xl font-bold mb-4">${totalValue.toLocaleString()}</p>
            <p className="text-sm text-gray-200">Estimated annual value across {results.length} matched benefits</p>
          </div>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Benefits (Ranked by Impact)</h2>
              <button
                onClick={() => {
                  setResults([]);
                  setShowPreview(true);
                }}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Start Over
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {results.map((b, idx) => (
                <section key={b.id} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold">{idx + 1}</span>
                        <h3 className="text-lg font-semibold text-gray-900">{b.title}</h3>
                      </div>
                      {b.impactUSD !== undefined && (
                        <p className="text-lg font-bold text-green-700">${b.impactUSD.toLocaleString()}/year</p>
                      )}
                    </div>
                    <button 
                      onClick={() => saveBenefit(b.id)}
                      className={`text-2xl ${savedIds.includes(b.id) ? 'opacity-100' : 'opacity-50 hover:opacity-100'} transition-opacity`}
                    >
                      {savedIds.includes(b.id) ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <p className="text-sm text-gray-700 mb-4"><strong>Why you qualify:</strong> {b.whyQualified}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex gap-2 text-xs text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded capitalize">{b.complexity}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded">{b.timeToApply}</span>
                      {b.approvalETA && <span className="px-2 py-1 bg-gray-100 rounded">{b.approvalETA}</span>}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">📋 What You'll Need:</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {b.docs.map((d) => <li key={d} className="flex gap-2"><span>•</span><span>{d}</span></li>)}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {b.links.map((l) => (
                      <a 
                        key={l.url} 
                        href={l.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-medium"
                      >
                        {l.label} →
                      </a>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 border-t-2 border-gray-200 pt-8">
            <button 
              onClick={exportPDF}
              className="flex-1 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              📥 Download My Benefits List
            </button>
            <button 
              onClick={() => {
                setResults([]);
                setShowPreview(true);
              }}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:border-gray-400 transition-colors"
            >
              🔄 Run Another Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddUpgradeTaskButton({ separationType }: { separationType: NonNullable<ReturnType<typeof String>> }) {
  const { data, missionPlan, addTask, updateData } = useOnboardingStore();
  const [added, setAdded] = useState(false);

  const createTask = (): MissionTask => ({
    id: 'task-discharge-upgrade',
    title: 'File Discharge Upgrade Request',
    description:
      'Discharge upgrades are common and applying does not reduce current benefits or harm VA claims. Many veterans succeed years after separation using new evidence, time passed, or inequities. This opens doors to VA healthcare, education, home loans, and hiring preferences.',
    category: 'admin',
    priority: 'high',
    completed: false,
    steps: [
      'Gather service records, DD-214, performance reports, and any new evidence',
      'Write a clear personal statement (what happened, what’s changed)',
      'Within 15 years: complete DD Form 293; after 15 years: complete DD Form 149',
      'Work with a VSO (DAV, VFW, American Legion) for support',
      'Submit package and monitor status; expect 3–6 months',
    ],
    notes:
      'Cadence provides guidance, not legal advice. No guarantees of approval. Consider inequities, policy changes, or medical evidence as supporting factors.',
  });

  return (
    <button
      type="button"
      onClick={() => {
        // Persist the nudge flag
        updateData({ dischargeUpgradeNudge: true, dischargeType: separationType as any });
        // Inject task if mission plan exists
        if (missionPlan) {
          addTask(createTask());
        }
        setAdded(true);
      }}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${added ? 'bg-green-600 text-white' : 'border-2 border-gray-300 text-gray-900 hover:border-gray-400'}`}
    >
      {added ? 'Added to Mission Plan' : 'Add to My Mission Plan'}
    </button>
  );
}
