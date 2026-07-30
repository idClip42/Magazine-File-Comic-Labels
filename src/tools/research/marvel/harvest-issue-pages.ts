import * as fs from "fs";
import * as path from "path";

const DEFAULT_QUEUE = "docs/MARVEL-BROWSER-HARVEST.md";
const DEFAULT_OUTPUT = "docs/research/marvel/MARVEL-ISSUE-PAGES.json";
const MARVEL_ISSUE_PATH = /^https:\/\/www\.marvel\.com\/comics\/issue\/\d+(?:\/|$)/i;

interface QueueEntry {
  labelId: string;
  labelDescription: string;
  issue: string;
  query?: string;
  officialPage?: string;
}

interface SearchResult {
  link?: string;
  title?: string;
  snippet?: string;
}

interface InventoryEntry extends QueueEntry {
  status: "existing" | "found" | "not-found" | "ambiguous" | "pending" | "error";
  candidates?: string[];
  searchedAt?: string;
  error?: string;
  source?: "queue" | "metadata-api" | "serper";
  seriesId?: number;
  seriesName?: string;
  title?: string;
  onSaleDate?: string;
}

interface Inventory {
  generatedAt: string;
  source: string;
  entries: InventoryEntry[];
}

function usage(): never {
  console.error(`Usage: npm run harvest:marvel-pages -- [options]

Reads the handoff queue and finds official Marvel issue pages. Results are
written as an inventory for review; this tool never edits the queue or
config/labels.json.

By default this uses the free Marvel Metadata API, an open metadata index that
preserves canonical Marvel issue-page URLs. It is a discovery source, not a
replacement for checking the official Marvel page before using its cover.

Options:
  --queue <path>        Queue Markdown (default: ${DEFAULT_QUEUE})
  --out <path>          Results JSON (default: ${DEFAULT_OUTPUT})
  --limit <number>      Search at most this many unresolved entries
  --label <id>          Search only one queue label; repeatable
  --concurrency <n>     Concurrent searches, 1-10 (default: 4)
  --provider <name>     metadata-api (default) or serper
  --refresh             Re-search entries already recorded as found
  --help                Show this message

Examples:
  npm run harvest:marvel-pages -- --label fantastic-four-003 --limit 25
  npm run harvest:marvel-pages -- --limit 100 --concurrency 4
`);
  process.exit(1);
}

const SERIES_BY_LABEL: Record<string, number> = {
  "fantastic-four-003": 2121, "fantastic-four-004": 2121, "fantastic-four-005": 2121,
  "fantastic-four-035": 2121, "fantastic-four-036": 2121, "fantastic-four-037": 2121,
  "fantastic-four-038": 2121, "fantastic-four-039": 2121, "fantastic-four-006": 2121,
  "fantastic-four-007": 2121, "fantastic-four-008": 2121, "fantastic-four-009": 2121,
  "fantastic-four-010": 2121, "fantastic-four-011": 2121, "fantastic-four-012": 2121,
  "fantastic-four-013": 2121,
  // Marvel's 1996 Heroes Reborn run ends at #12. The queue's #13-70 and
  // subsequent legacy numbering belong to the 1998 series.
  "fantastic-four-015": 421, "fantastic-four-016": 421, "fantastic-four-042": 421,
  "fantastic-four-017": 421, "fantastic-four-018": 421, "fantastic-four-043": 421,
  "fantastic-four-046": 24554, "fantastic-four-047": 24554,
  "fantastic-four-048": 34035, "fantastic-four-049": 34035, "fantastic-four-050": 42598,
  "new-mutants-001": 2055, "new-mutants-002": 2055, "new-mutants-003": 2055, "new-mutants-004": 2055,
  "x-men-001": 2258, "x-men-002": 2258, "x-men-003": 2258, "x-men-004": 2258,
  "x-men-005": 2258, "x-men-006": 2258, "x-men-007": 2258,
  "excalibur-001": 2011, "excalibur-002": 2011, "excalibur-003": 2011,
  "earth-x-001": 378, "ultimate-spider-man-001": 466, "ultimates-001": 664,
};

interface MetadataIssue {
  issueNumber: string;
  detailUrl: string;
  seriesId: number;
  seriesName: string;
  title: string;
  onSaleDate?: string;
}

async function fetchMetadataSeries(seriesId: number): Promise<MetadataIssue[]> {
  const response = await fetch(`https://marvel.emreparker.com/v1/series/${seriesId}/issues?limit=500`);
  if (!response.ok) throw new Error(`Metadata API returned HTTP ${response.status} for series ${seriesId}`);
  const payload = (await response.json()) as { items?: MetadataIssue[] };
  return payload.items ?? [];
}

function takeOption(args: string[], name: string): string[] {
  const values: string[] = [];
  for (let index = args.indexOf(name); index !== -1; index = args.indexOf(name, index + 1)) {
    const value = args[index + 1];
    if (!value || value.startsWith("--")) usage();
    values.push(value);
  }
  return values;
}

function normaliseMarvelUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (!MARVEL_ISSUE_PATH.test(url.toString())) return undefined;
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

function queryFromGoogleLink(link: string): string | undefined {
  try {
    const url = new URL(link);
    if (url.hostname !== "www.google.com") return undefined;
    return url.searchParams.get("q") ?? undefined;
  } catch {
    return undefined;
  }
}

function parseQueue(markdown: string): QueueEntry[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const entries: QueueEntry[] = [];
  let labelId = "";
  let labelDescription = "";

  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index].match(/^### `([^`]+)`\s+—\s+(.+)$/);
    if (heading) {
      [, labelId, labelDescription] = heading;
      continue;
    }

    const issue = lines[index].match(/^- \[[ x]\] #(.+?)\s+—\s+\[([^\]]+)\]\(([^)]+)\)$/);
    if (!issue || !labelId) continue;

    const [, issueNumber, , discoveryLink] = issue;
    const directPage = normaliseMarvelUrl(discoveryLink);
    let officialPage = directPage;
    for (let lookahead = index + 1; lookahead < lines.length && lines[lookahead].startsWith("  "); lookahead += 1) {
      const saved = lines[lookahead].match(/^  - Official Marvel page URL:\s*(\S+)?\s*$/);
      if (saved?.[1]) officialPage = normaliseMarvelUrl(saved[1]) ?? officialPage;
    }

    entries.push({
      labelId,
      labelDescription,
      issue: issueNumber,
      query: directPage ? undefined : queryFromGoogleLink(discoveryLink),
      officialPage,
    });
  }
  return entries;
}

function readInventory(outputPath: string): InventoryEntry[] {
  if (!fs.existsSync(outputPath)) return [];
  const value = JSON.parse(fs.readFileSync(outputPath, "utf8")) as Partial<Inventory>;
  return Array.isArray(value.entries) ? value.entries : [];
}

async function searchSerper(query: string, apiKey: string): Promise<SearchResult[]> {
  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
    body: JSON.stringify({ q: query, num: 10 }),
  });
  if (!response.ok) throw new Error(`Serper returned HTTP ${response.status}`);
  const payload = (await response.json()) as { organic?: SearchResult[] };
  return payload.organic ?? [];
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help")) usage();
  const queuePath = takeOption(args, "--queue")[0] ?? DEFAULT_QUEUE;
  const outputPath = takeOption(args, "--out")[0] ?? DEFAULT_OUTPUT;
  const labelFilter = new Set(takeOption(args, "--label"));
  const limitText = takeOption(args, "--limit")[0];
  const concurrencyText = takeOption(args, "--concurrency")[0] ?? "4";
  const limit = limitText === undefined ? Number.POSITIVE_INFINITY : Number(limitText);
  const concurrency = Number(concurrencyText);
  const provider = takeOption(args, "--provider")[0] ?? "metadata-api";
  if ((!Number.isFinite(limit) && limit !== Number.POSITIVE_INFINITY) || limit < 0 || !Number.isInteger(concurrency) || concurrency < 1 || concurrency > 10) usage();
  if (provider !== "metadata-api" && provider !== "serper") usage();
  const serperApiKey = process.env.SERPER_API_KEY;
  if (provider === "serper" && !serperApiKey) throw new Error("SERPER_API_KEY is required for --provider serper.");

  const queue = parseQueue(fs.readFileSync(queuePath, "utf8"));
  const existing = readInventory(outputPath);
  const refresh = args.includes("--refresh");
  const byKey = new Map(existing.map((entry) => [`${entry.labelId}#${entry.issue}`, entry]));
  const candidates = queue.filter((entry) => {
    if (labelFilter.size && !labelFilter.has(entry.labelId)) return false;
    if (entry.officialPage || !entry.query) return false;
    const prior = byKey.get(`${entry.labelId}#${entry.issue}`);
    return refresh || !prior || prior.status === "error";
  }).slice(0, limit);

  for (const entry of queue.filter((item) => item.officialPage)) {
    byKey.set(`${entry.labelId}#${entry.issue}`, { ...entry, status: "existing", source: "queue" });
  }

  if (provider === "metadata-api") {
    const selected = queue.filter((entry) => !labelFilter.size || labelFilter.has(entry.labelId));
    const seriesIds = [...new Set(selected.map((entry) => SERIES_BY_LABEL[entry.labelId]).filter((id): id is number => id !== undefined))];
    const series = new Map<number, MetadataIssue[]>();
    await Promise.all(seriesIds.map(async (seriesId) => series.set(seriesId, await fetchMetadataSeries(seriesId))));
    let searched = 0;
    for (const entry of selected) {
      if (searched >= limit) break;
      const seriesId = SERIES_BY_LABEL[entry.labelId];
      if (!seriesId) {
        byKey.set(`${entry.labelId}#${entry.issue}`, { ...entry, status: "error", error: "No configured metadata-series mapping", source: "metadata-api" });
        continue;
      }
      const match = series.get(seriesId)?.find((issue) => issue.issueNumber === entry.issue);
      searched += 1;
      if (!match) {
        byKey.set(`${entry.labelId}#${entry.issue}`, { ...entry, status: "not-found", error: `Issue not present in metadata series ${seriesId}`, source: "metadata-api", seriesId });
        continue;
      }
      const officialPage = normaliseMarvelUrl(match.detailUrl);
      byKey.set(`${entry.labelId}#${entry.issue}`, {
        ...entry, officialPage, status: officialPage ? "found" : "error", source: "metadata-api",
        seriesId: match.seriesId, seriesName: match.seriesName, title: match.title, onSaleDate: match.onSaleDate,
        error: officialPage ? undefined : "Metadata response did not contain a canonical Marvel issue URL",
      });
    }
  }

  let next = 0;
  async function worker(): Promise<void> {
    while (next < candidates.length) {
      const entry = candidates[next++];
      process.stdout.write(`Searching ${entry.labelId} #${entry.issue}\n`);
      try {
        const results = await searchSerper(entry.query!, serperApiKey!);
        const urls = [...new Set(results.map((result) => normaliseMarvelUrl(result.link ?? "")).filter((url): url is string => Boolean(url)))];
        byKey.set(`${entry.labelId}#${entry.issue}`, {
          ...entry,
          status: urls.length === 1 ? "found" : urls.length ? "ambiguous" : "not-found",
          candidates: urls,
          searchedAt: new Date().toISOString(),
        });
      } catch (error) {
        byKey.set(`${entry.labelId}#${entry.issue}`, {
          ...entry,
          status: "error",
          searchedAt: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }
  if (provider === "serper") await Promise.all(Array.from({ length: Math.min(concurrency, candidates.length) }, worker));

  const inventory: Inventory = {
    generatedAt: new Date().toISOString(),
    source: queuePath,
    entries: queue.map((entry) => byKey.get(`${entry.labelId}#${entry.issue}`) ?? {
      ...entry,
      status: entry.query ? "pending" : "error",
      error: entry.query ? "Not searched yet" : "No usable discovery query in queue",
    }),
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(inventory, null, 2)}\n`);
  const counts = inventory.entries.reduce<Record<string, number>>((total, entry) => {
    total[entry.status] = (total[entry.status] ?? 0) + 1;
    return total;
  }, {});
  console.log(`Wrote ${outputPath}: ${JSON.stringify(counts)}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
