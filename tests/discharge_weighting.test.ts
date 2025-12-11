import { } from "../app/benefits-scanner/page";

// Note: benefits-scanner is a React component; we validate the weighting function via a tiny reimplementation here

type Category = "education" | "finance" | "health" | "career" | "cash" | "other";

function rankByImpactShim(benefits: { category: Category; impactUSD?: number }[], sep: "honorable"|"general"|"other-than-honorable", hasCode: boolean) {
  const weights: Record<Category, number> = {
    education: sep === "honorable" ? 1.0 : 0.85,
    finance: hasCode ? 1.1 : 1.0,
    health: hasCode ? 1.15 : 1.05,
    career: sep === "honorable" ? 1.0 : 0.95,
    cash: hasCode ? 1.1 : 1.0,
    other: 1.0,
  };
  return [...benefits]
    .map(b => ({ ...b, score: (b.impactUSD ?? 0) * (weights[b.category] ?? 1.0) }))
    .sort((a,b) => (b.score ?? 0) - (a.score ?? 0));
}

function run() {
  const benefits: { category: Category; impactUSD?: number }[] = [
    { category: "education", impactUSD: 24000 },
    { category: "finance", impactUSD: 1800 },
    { category: "health", impactUSD: 2000 },
  ];
  const rankedHon = rankByImpactShim(benefits, "honorable", false);
  const rankedNonHonWithCode = rankByImpactShim(benefits, "other-than-honorable", true);
  console.log("Top (honorable):", rankedHon[0].category);
  console.log("Top (non-honorable+code):", rankedNonHonWithCode[0].category);
}

run();
