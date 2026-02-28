"use client";

import { useEffect, useMemo, useState } from "react";
import { useOnboardingStore } from "@/lib/useOnboardingStore";
import type { MilitaryBranch } from "@/lib/types";
import Image from "next/image";

const BRANCHES: MilitaryBranch[] = [
  "Army",
  "Navy",
  "Air Force",
  "Marine Corps",
  "Coast Guard",
  "Space Force",
];

const BRANCH_EMBLEMS: Record<MilitaryBranch, string> = {
  "Army": "/military-emblems/army-emblem.svg",
  "Navy": "/military-emblems/navy-emblem.svg",
  "Air Force": "/military-emblems/airforce-emblem.svg",
  "Marine Corps": "/military-emblems/marines-emblem.svg",
  "Coast Guard": "/military-emblems/coastguard-emblem.svg",
  "Space Force": "/military-emblems/spaceforce-emblem.svg",
};

export default function BranchSwitcher({ compact = false }: { compact?: boolean }) {
  const data = useOnboardingStore((s) => s.data);
  const updateData = useOnboardingStore((s) => s.updateData);
  const current = data.branch;
  const [isOpen, setIsOpen] = useState(false);

  const label = useMemo(() => (compact ? "Branch" : "Your service branch"), [compact]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("cadence-preferred-branch") as MilitaryBranch | null;
    if (!current && stored) {
      updateData({ branch: stored });
    }
  }, [current, updateData]);

  const handleSelect = (branch: MilitaryBranch) => {
    updateData({ branch });
    if (typeof window !== "undefined") {
      localStorage.setItem("cadence-preferred-branch", branch);
    }
    setIsOpen(false);
  };

  return (
    <div className="branch-switcher">
      <label className="branch-switcher-label text-xs font-medium opacity-80 block mb-2">
        {label}
      </label>
      
      <div className="relative">
        {/* Display Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-3 py-2 border-2 rounded-md transition-colors w-full text-left branch-switcher-button"
        >
          {current ? (
            <>
              <Image
                src={BRANCH_EMBLEMS[current]}
                alt={current}
                width={32}
                height={32}
                className="flex-shrink-0"
              />
              <span className="text-sm font-medium">{current}</span>
            </>
          ) : (
            <span className="text-sm opacity-50">Select Branch</span>
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 border-2 rounded-md shadow-lg z-50 branch-switcher-dropdown">
            {BRANCHES.map((branch) => (
              <button
                key={branch}
                onClick={() => handleSelect(branch)}
                className="w-full flex items-center gap-3 px-3 py-2 transition-colors border-b last:border-b-0 branch-switcher-item"
              >
                <Image
                  src={BRANCH_EMBLEMS[branch]}
                  alt={branch}
                  width={28}
                  height={28}
                  className="flex-shrink-0"
                />
                <span className="text-sm font-medium">{branch}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
