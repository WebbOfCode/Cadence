"use client";

import { useEffect, useMemo } from "react";
import { useOnboardingStore } from "@/lib/useOnboardingStore";
import type { MilitaryBranch } from "@/lib/types";

const BRANCHES: MilitaryBranch[] = [
  "Army",
  "Navy",
  "Air Force",
  "Marine Corps",
  "Coast Guard",
  "Space Force",
];

export default function BranchSwitcher({ compact = false }: { compact?: boolean }) {
  const data = useOnboardingStore((s) => s.data);
  const updateData = useOnboardingStore((s) => s.updateData);
  const current = data.branch;

  const label = useMemo(() => (compact ? "Branch" : "Your service branch"), [compact]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("cadence-preferred-branch") as MilitaryBranch | null;
    if (!current && stored) {
      updateData({ branch: stored });
    }
  }, [current, updateData]);

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium opacity-80" htmlFor="branch-switcher">
        {label}
      </label>
      <select
        id="branch-switcher"
        value={current ?? ""}
        onChange={(e) => {
          const nextBranch = e.target.value as MilitaryBranch;
          updateData({ branch: nextBranch });
          if (typeof window !== "undefined") {
            localStorage.setItem("cadence-preferred-branch", nextBranch);
          }
        }}
        className="text-sm border-2 rounded-md px-2 py-1 bg-white text-black border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-300"
      >
        <option value="" disabled>
          Select
        </option>
        {BRANCHES.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
    </div>
  );
}
