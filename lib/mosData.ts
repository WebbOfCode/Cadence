export type Branch = "army" | "navy" | "air_force" | "marines" | "space_force" | "coast_guard";

export type MosCategory =
  | "combat_arms"
  | "combat_support"
  | "intel"
  | "it"
  | "maintenance"
  | "aviation"
  | "logistics"
  | "medical"
  | "admin"
  | "law_enforcement"
  | "other";

export type ClearanceLevel = "none" | "confidential" | "secret" | "ts" | "ts_sci";

export interface MosProfile {
  branch: Branch;
  code: string; // e.g., "25B"
  title: string; // e.g., "Information Technology Specialist"
  category: MosCategory;
  enlistedOfficer: "enlisted" | "officer" | "warrant";
  typicalRanks: string[]; // ["E-3","E-6"]
  level: "entry" | "mid" | "senior";
  clearance: ClearanceLevel;
  deploymentLikely: boolean;
  environments: string[]; // ["garrison","field","deployed"]
  coreCompetencies: string[];
  secondaryCompetencies: string[];
  managementComponent: number; // 0–1
  handsOnComponent: number; // 0–1
  onetTargets: string[]; // e.g., ["15-1232.00"]
  civilianClusters: string[]; // e.g., ["help_desk","logistics_supervisor"]
  coolCerts: string[]; // e.g., ["CompTIA A+","Security+"]
  typicalCivilianJobTitles: string[];
}

export interface CertPath {
  name: string;
  provider: "CompTIA" | "AWS" | "PMI" | "Cisco" | "ISC2";
  estimatedStudyTimeHours: number;
  examCostUSD: number;
  coveredByCool: boolean;
}

// --- Adapters (stubs to be implemented with real data) ---
export async function getOnetCrosswalk(mosCode: string, branch: Branch): Promise<string[]> {
  // Memoized cache check
  const key = `crosswalk:${branch}:${mosCode.toUpperCase()}`;
  if (memCache[key]) return memCache[key];
  // Try CSV mirror first (client-safe via fetch from /data)
  try {
    const rows = await readCsvWeb('/data/onet_crosswalk.csv');
    const matches = rows.filter((r: any) => r.branch === branch && r.mos.toUpperCase() === mosCode.toUpperCase());
    if (matches.length > 0) {
      memCache[key] = matches.map((m: any) => m.soc);
      return memCache[key];
    }
  } catch {}
  // Live fetcher (best-effort): O*NET Military Crosswalk page scraping or API proxy (TODO)
  // For now, fallback heuristics
  // Fallback
  if (/^25/.test(mosCode)) return ["15-1232.00"]; // Network Support Specialists
  if (/^68/.test(mosCode)) return ["29-2010.00"]; // Medical records/specimens (example)
  if (/^92/.test(mosCode)) return ["11-1021.00"]; // general management/logistics
  if (/^11/.test(mosCode)) return ["33-9032.00"]; // Security guards/supervisors
  if (/^42/.test(mosCode)) return ["43-4161.00"]; // HR assistants
  return ["11-1021.00"]; // fallback
}

export async function getCoolCerts(mosCode: string, branch: Branch): Promise<CertPath[]> {
  // TODO: fetch from DoD COOL or local catalog
  if (/^25/.test(mosCode)) {
    return [
      { name: "CompTIA A+", provider: "CompTIA", estimatedStudyTimeHours: 40, examCostUSD: 246, coveredByCool: true },
      { name: "Security+", provider: "CompTIA", estimatedStudyTimeHours: 60, examCostUSD: 370, coveredByCool: true },
      { name: "AWS Cloud Practitioner", provider: "AWS", estimatedStudyTimeHours: 24, examCostUSD: 100, coveredByCool: false },
    ];
  }
  return [];
}

export async function getBlSalaries(soc: string, state: string, metro?: string): Promise<{ median: number; p25: number; p75: number } | null> {
  const key = `wage:${soc}:${state}`;
  if (memCache[key]) return memCache[key];
  // Use CSV mirror by SOC+state; ignore metro for v1 (client-safe via fetch)
  try {
    const rows = await readCsvWeb('/data/bls_oes_state.csv');
    const match = rows.find((r: any) => r.soc === soc && r.state === state);
    if (match) {
      memCache[key] = { median: Number(match.median), p25: Number(match.p25), p75: Number(match.p75) };
      return memCache[key];
    }
  } catch {}
  // Live fetcher (best-effort): BLS API proxy (TODO)
  // Fallback simple heuristic
  const base = soc.startsWith("15-") ? 75000 : 60000;
  return { median: base, p25: Math.round(base * 0.8), p75: Math.round(base * 1.25) };
}

export async function zipToStateMetro(zip: string): Promise<{ state: string; metro?: string } | null> {
  const zip5 = zip.slice(0, 5);
  const z = parseInt(zip5, 10);
  if (isNaN(z)) return null;

  // Try CSV-backed lookup first (dense metro ZIPs)
  if (!memCache.zipStateMap) {
    try {
      const rows = await readCsvWeb('/data/zip_state.csv');
      memCache.zipStateMap = rows.reduce((acc: Record<string, string>, r: any) => {
        acc[r.zip] = r.state;
        return acc;
      }, {} as Record<string, string>);
    } catch {}
  }

  const mappedState = memCache.zipStateMap?.[zip5];
  if (mappedState) return { state: mappedState };

  // Fallback by range when CSV lacks the ZIP
  if (z >= 90000 && z <= 96199) return { state: "CA", metro: "Los Angeles" };
  if (z >= 32000 && z <= 34999) return { state: "FL" };
  if (z >= 10000 && z <= 14999) return { state: "NY" };
  if (z >= 20000 && z <= 20599) return { state: "DC" };
  if (z >= 22000 && z <= 24699) return { state: "VA" };
  if (z >= 38600 && z <= 39799) return { state: "MS", metro: "Jackson" };
  if (z >= 75000 && z <= 79999) return { state: "TX", metro: "Houston" };
  return null;
}

// --- In-memory memo cache ---
const memCache: Record<string, any> = {};

// --- CSV reader helper (web/client-safe) ---
async function readCsvWeb(path: string): Promise<any[]> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  const text = await res.text();
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(',');
  return lines.map(line => {
    const cols = line.split(',');
    const obj: any = {};
    headers.forEach((h, i) => { obj[h] = cols[i]; });
    return obj;
  });
}
