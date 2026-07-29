import fs from "node:fs";
import path from "node:path";

const RUNS_PATH = "docs/MARVEL-ADDITIONAL-RUNS.json";
const OUTPUT_PATH = "docs/MARVEL-ADDITIONAL-ISSUE-PAGES.json";

type Run = { id: string; labelId: string; seriesId: number; issues: [number, number] };
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
  const manifest = JSON.parse(fs.readFileSync(RUNS_PATH, "utf8")) as { runs?: Run[] };
  if (!Array.isArray(manifest.runs)) throw new Error(`${RUNS_PATH} does not contain runs.`);
  const series = new Map<number, MetadataIssue[]>();
  for (const seriesId of [...new Set(manifest.runs.map(run => run.seriesId))]) series.set(seriesId, await fetchSeries(seriesId));
  const entries: Entry[] = [];
  for (const run of manifest.runs) {
    for (let issue = run.issues[0]; issue <= run.issues[1]; issue += 1) {
      const match = series.get(run.seriesId)?.find(item => item.issueNumber === String(issue));
      entries.push({
        runId: run.id, labelId: run.labelId, issue, seriesId: run.seriesId,
        seriesName: match?.seriesName, title: match?.title, onSaleDate: match?.onSaleDate,
        officialPage: match ? officialPage(match.detailUrl) : undefined,
        status: match && officialPage(match.detailUrl) ? "found" : "not-found",
      });
    }
  }
  const inventory = { generatedAt: new Date().toISOString(), source: RUNS_PATH, entries };
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(inventory, null, 2)}\n`);
  const found = entries.filter(entry => entry.status === "found").length;
  console.log(`Wrote ${OUTPUT_PATH}: ${found} found, ${entries.length - found} not found.`);
}

main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
