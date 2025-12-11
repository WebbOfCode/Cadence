"use client";

import { useMemo } from "react";
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

  const label = useMemo(() => (compact ? "Branch" : "Preview as branch"), [compact]);

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium opacity-80" htmlFor="branch-switcher">
        {label}
      </label>
      <select
        id="branch-switcher"
        value={current ?? ""}
        onChange={(e) => updateData({ branch: e.target.value as MilitaryBranch })}
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
