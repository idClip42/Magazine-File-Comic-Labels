import fs from "node:fs";
import path from "node:path";

const RUNS_PATH = "docs/research/marvel/MARVEL-ADDITIONAL-RUNS.json";
const OUTPUT_PATH = "docs/research/marvel/MARVEL-ADDITIONAL-ISSUE-PAGES.json";

type Run = { id: string; labelId: string; seriesId: number; issues: [number, number]; officialPageOverrides?: Record<string, string> };
type MetadataIssue = { issueNumber: string; detailUrl: string; seriesId: number; seriesName: string; title: string; onSaleDate?: string };
type Entry = {
  runId: string; labelId: string; issue: number; seriesId: number; seriesName?: string; title?: string; onSaleDate?: string;
  officialPage?: string; status: "found" | "not-found";
};

function officialPage(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (url.hostname !== "www.marvel.com" || !/^\/comics\/issue\/\d+(?:\/|$)/.test(url.pathname)) return undefined;
    url.search = ""; url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch { return undefined; }
}

async function fetchSeries(seriesId: number): Promise<MetadataIssue[]> {
  const response = await fetch(`https://marvel.emreparker.com/v1/series/${seriesId}/issues?limit=500`);
  if (!response.ok) throw new Error(`Metadata API returned HTTP ${response.status} for series ${seriesId}`);
  return ((await response.json()) as { items?: MetadataIssue[] }).items ?? [];
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const runsIndex = args.indexOf("--runs");
  const outputIndex = args.indexOf("--out");
  if (args.some((arg, index) => arg !== "--runs" && arg !== "--out" && index !== runsIndex + 1 && index !== outputIndex + 1) || (runsIndex >= 0 && !args[runsIndex + 1]) || (outputIndex >= 0 && !args[outputIndex + 1])) throw new Error("Usage: ts-node src/marvel-additional-pages-cli.ts [--runs <path>] [--out <path>]");
  const runsPath = runsIndex >= 0 ? args[runsIndex + 1] : RUNS_PATH;
  const outputPath = outputIndex >= 0 ? args[outputIndex + 1] : OUTPUT_PATH;
  const manifest = JSON.parse(fs.readFileSync(runsPath, "utf8")) as { runs?: Run[] };
  if (!Array.isArray(manifest.runs)) throw new Error(`${runsPath} does not contain runs.`);
  const series = new Map<number, MetadataIssue[]>();
  for (const seriesId of [...new Set(manifest.runs.map(run => run.seriesId))]) {
    const runs = manifest.runs.filter(run => run.seriesId === seriesId);
    const allOverridden = runs.every(run => {
      for (let issue = run.issues[0]; issue <= run.issues[1]; issue += 1) if (!run.officialPageOverrides?.[String(issue)]) return false;
      return true;
    });
    series.set(seriesId, allOverridden ? [] : await fetchSeries(seriesId));
  }
  const entries: Entry[] = [];
  for (const run of manifest.runs) {
    for (let issue = run.issues[0]; issue <= run.issues[1]; issue += 1) {
      const match = series.get(run.seriesId)?.find(item => item.issueNumber === String(issue));
      const override = run.officialPageOverrides?.[String(issue)];
      const page = match ? officialPage(match.detailUrl) : override ? officialPage(override) : undefined;
      entries.push({
        runId: run.id, labelId: run.labelId, issue, seriesId: run.seriesId,
        seriesName: match?.seriesName, title: match?.title, onSaleDate: match?.onSaleDate,
        officialPage: page,
        status: page ? "found" : "not-found",
      });
    }
  }
  const inventory = { generatedAt: new Date().toISOString(), source: runsPath, entries };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(inventory, null, 2)}\n`);
  const found = entries.filter(entry => entry.status === "found").length;
  console.log(`Wrote ${outputPath}: ${found} found, ${entries.length - found} not found.`);
}

main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
