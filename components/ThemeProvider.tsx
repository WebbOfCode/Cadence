"use client";

import { useEffect } from "react";
import { useOnboardingStore } from "@/lib/useOnboardingStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const branch = useOnboardingStore((s) => s.data.branch);

  useEffect(() => {
    const root = document.documentElement;
    if (branch) {
      root.setAttribute("data-branch", branch);
    } else {
      root.removeAttribute("data-branch");
    }
  }, [branch]);

  return children as JSX.Element;
}
