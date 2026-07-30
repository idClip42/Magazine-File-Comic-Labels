import * as fs from "fs";
import * as path from "path";
import {
  cleanMarvelCoverUrl,
  fetchMarvelCover,
  MARVEL_BLOCK_THRESHOLD,
  wait,
} from "./cover-discovery";

const DEFAULT_PAGES = "docs/research/marvel/MARVEL-ISSUE-PAGES.json";
const DEFAULT_OUTPUT = "docs/research/marvel/MARVEL-COVER-URLS.json";
const DEFAULT_DELAY_MS = 2_000;
const BLOCK_THRESHOLD = MARVEL_BLOCK_THRESHOLD;

type PageEntry = {
  labelId: string;
  issue: string;
  officialPage?: string;
  status: string;
  title?: string;
  seriesId?: number;
  seriesName?: string;
  onSaleDate?: string;
};

type CoverStatus = "pending" | "found" | "no-cover-found" | "fetch-error" | "blocked";
type CoverEntry = Pick<PageEntry, "labelId" | "issue" | "officialPage" | "title" | "seriesId" | "seriesName" | "onSaleDate"> & {
  status: CoverStatus;
  sourceImageUrl?: string;
  cleanImageUrl?: string;
  extractedAt?: string;
  error?: string;
};

type CoverInventory = {
  generatedAt: string;
  source: string;
  requestDelayMs: number;
  stoppedForBlocking: boolean;
  entries: CoverEntry[];
};

function usage(): never {
  console.error(`Usage: npm run harvest:marvel-covers -- [options]

Visits official Marvel issue pages one at a time and records their page-exposed
cover URL. Successful entries are never fetched again unless --refresh is used.
The run stops after ${BLOCK_THRESHOLD} consecutive 403/429 responses.

Options:
  --pages <path>       Issue-page inventory (default: ${DEFAULT_PAGES})
  --out <path>         Cover inventory (default: ${DEFAULT_OUTPUT})
  --limit <number>     Visit at most this many still-pending pages
  --delay-ms <number>  Delay between requests (default: ${DEFAULT_DELAY_MS})
  --label <id>         Limit to one label; repeatable
  --refresh            Retry entries previously found
  --help               Show this message
`);
  process.exit(1);
}

function optionValues(args: string[], name: string): string[] {
  const values: string[] = [];
  for (let index = args.indexOf(name); index >= 0; index = args.indexOf(name, index + 1)) {
    const value = args[index + 1];
    if (!value || value.startsWith("--")) usage();
    values.push(value);
  }
  return values;
}

function keyFor(entry: Pick<PageEntry, "labelId" | "issue">): string {
  return `${entry.labelId}#${entry.issue}`;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help")) usage();
  const pagesPath = optionValues(args, "--pages")[0] ?? DEFAULT_PAGES;
  const outputPath = optionValues(args, "--out")[0] ?? DEFAULT_OUTPUT;
  const labels = new Set(optionValues(args, "--label"));
  const limitText = optionValues(args, "--limit")[0];
  const delayText = optionValues(args, "--delay-ms")[0] ?? String(DEFAULT_DELAY_MS);
  const limit = limitText === undefined ? Number.POSITIVE_INFINITY : Number(limitText);
  const delayMs = Number(delayText);
  if ((!Number.isFinite(limit) && limit !== Number.POSITIVE_INFINITY) || limit < 0 || !Number.isInteger(delayMs) || delayMs < 500) usage();

  const pages = JSON.parse(fs.readFileSync(pagesPath, "utf8")) as { entries?: PageEntry[] };
  if (!Array.isArray(pages.entries)) throw new Error(`${pagesPath} does not contain an entries array.`);
  const previous: Partial<CoverInventory> = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, "utf8")) : {};
  const byKey = new Map((previous.entries ?? []).map(entry => [keyFor(entry), entry]));
  const eligible = pages.entries.filter(entry => entry.status === "found" && entry.officialPage && (!labels.size || labels.has(entry.labelId)));
  let attempts = 0;
  let consecutiveBlocks = 0;
  let stoppedForBlocking = false;

  for (const page of eligible) {
    if (attempts >= limit || stoppedForBlocking) break;
    const key = keyFor(page);
    const existing = byKey.get(key);
    if (existing?.status === "found" && !args.includes("--refresh")) continue;
    if (attempts > 0) await wait(delayMs);
    attempts += 1;
    process.stdout.write(`Fetching ${page.labelId} #${page.issue}\n`);
    try {
      const result = await fetchMarvelCover(page.officialPage!);
      if (result.status === 403 || result.status === 429) consecutiveBlocks += 1;
      else consecutiveBlocks = 0;
      const status: CoverStatus = result.status === 403 || result.status === 429 ? "blocked" : result.status >= 400 ? "fetch-error" : result.cover ? "found" : "no-cover-found";
      byKey.set(key, {
        ...page, status, sourceImageUrl: result.cover, cleanImageUrl: result.cover ? cleanMarvelCoverUrl(result.cover) : undefined,
        extractedAt: new Date().toISOString(), error: result.status >= 400 ? `Marvel returned HTTP ${result.status}` : result.cover ? undefined : "No Marvel CDN cover URL found in page HTML",
      });
      if (consecutiveBlocks >= BLOCK_THRESHOLD) stoppedForBlocking = true;
    } catch (error) {
      byKey.set(key, { ...page, status: "fetch-error", extractedAt: new Date().toISOString(), error: error instanceof Error ? error.message : String(error) });
    }
  }

  const entries: CoverEntry[] = pages.entries
    .filter(entry => entry.status === "found" && entry.officialPage)
    .map(page => byKey.get(keyFor(page)) ?? ({ ...page, status: "pending" as const }));
  const inventory: CoverInventory = { generatedAt: new Date().toISOString(), source: pagesPath, requestDelayMs: delayMs, stoppedForBlocking, entries };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(inventory, null, 2)}\n`);
  const counts = entries.reduce<Record<string, number>>((total, entry) => ({ ...total, [entry.status]: (total[entry.status] ?? 0) + 1 }), {});
  console.log(`Wrote ${outputPath}: ${JSON.stringify(counts)}${stoppedForBlocking ? " (stopped after repeated blocking)" : ""}`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
