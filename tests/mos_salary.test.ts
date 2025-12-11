import { getOnetCrosswalk, zipToStateMetro, getBlSalaries } from "../lib/mosData";

async function run() {
  const mos = "25B";
  const onet = await getOnetCrosswalk(mos, "army");
  if (!onet.length) throw new Error("No SOC for MOS");
  const ca = await zipToStateMetro("90210");
  const ms = await zipToStateMetro("39201");
  if (!ca || !ms) throw new Error("ZIP to state failed");
  const wagesCA = await getBlSalaries(onet[0], ca.state, ca.metro);
  const wagesMS = await getBlSalaries(onet[0], ms.state, ms.metro);
  console.log("CA median:", wagesCA?.median, "MS median:", wagesMS?.median);
  if (!wagesCA || !wagesMS) throw new Error("Wage lookup failed");
  if (!(wagesCA.median > wagesMS.median)) throw new Error("Expected CA > MS for 25B");
  console.log("OK: Wage ordering holds for 25B");
}

run().catch(err => { console.error(err); process.exit(1); });
