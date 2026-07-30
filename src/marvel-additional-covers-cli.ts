import fs from "node:fs";
import path from "node:path";

const PAGES_PATH = "docs/MARVEL-ADDITIONAL-ISSUE-PAGES.json";
const OUTPUT_PATH = "docs/MARVEL-ADDITIONAL-COVER-URLS.json";
const DELAY_MS = 500;
const BLOCK_THRESHOLD = 3;

type PageEntry = { runId: string; labelId: string; issue: number; officialPage?: string; status: string; seriesId: number; seriesName?: string; title?: string; onSaleDate?: string };
type CoverEntry = PageEntry & { status: "pending" | "found" | "no-cover-found" | "fetch-error" | "blocked"; sourceImageUrl?: string; cleanImageUrl?: string; extractedAt?: string; error?: string };

function keyFor(entry: Pick<PageEntry, "runId" | "issue">): string { return `${entry.runId}#${entry.issue}`; }
function sleep(milliseconds: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, milliseconds)); }
function canonicalUrl(value: string): string | undefined {
  try {
    const url = new URL(value.replace(/\\u002F/g, "/").replace(/\\\//g, "/"));
    if (url.hostname !== "cdn.marvel.com" || !/\.(?:jpe?g|png|webp)$/i.test(url.pathname)) return undefined;
    url.search = ""; url.hash = ""; return url.toString();
  } catch { return undefined; }
}
function findCoverUrl(html: string): string | undefined {
  const decoded = html.replace(/\\u002F/g, "/").replace(/\\\//g, "/");
  const urls = [...decoded.matchAll(/https:\/\/cdn\.marvel\.com\/[^"'<>\\\s]+?\.(?:jpe?g|png|webp)/gi)]
    .map(match => canonicalUrl(match[0])).filter((url): url is string => Boolean(url));
  return [...new Set(urls)].sort((a, b) => score(b) - score(a))[0];
}
function score(url: string): number { return /\/portrait_uncanny\./i.test(url) ? 100 : /\/clean\./i.test(url) ? 90 : /\/portrait_incredible\./i.test(url) ? 80 : 0; }
function cleanVariant(value: string): string | undefined {
  const url = new URL(value);
  if (!/\/portrait_uncanny\.(?:jpe?g|png|webp)$/i.test(url.pathname)) return undefined;
  url.pathname = url.pathname.replace(/portrait_uncanny\.(?:jpe?g|png|webp)$/i, "clean.jpg");
  return url.toString();
}
async function fetchCover(url: string): Promise<{ status: number; cover?: string }> {
  const response = await fetch(url, { headers: { Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "en-US,en;q=0.8", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36" }, signal: AbortSignal.timeout(30_000) });
  return response.ok ? { status: response.status, cover: findCoverUrl(await response.text()) } : { status: response.status };
}
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const refresh = args.includes("--refresh");
  const limitIndex = args.indexOf("--limit");
  const pagesIndex = args.indexOf("--pages");
  const outputIndex = args.indexOf("--out");
  const limit = limitIndex === -1 ? Number.POSITIVE_INFINITY : Number(args[limitIndex + 1]);
  if (args.some((arg, index) => arg !== "--refresh" && arg !== "--limit" && arg !== "--pages" && arg !== "--out" && index !== limitIndex + 1 && index !== pagesIndex + 1 && index !== outputIndex + 1) || !Number.isInteger(limit) || limit < 1 || (pagesIndex >= 0 && !args[pagesIndex + 1]) || (outputIndex >= 0 && !args[outputIndex + 1])) throw new Error("Usage: npm run harvest:additional-marvel-covers [-- --pages <path>] [--out <path>] [--limit <number>] [--refresh]");
  const pagesPath = pagesIndex >= 0 ? args[pagesIndex + 1] : PAGES_PATH;
  const outputPath = outputIndex >= 0 ? args[outputIndex + 1] : OUTPUT_PATH;
  const pages = JSON.parse(fs.readFileSync(pagesPath, "utf8")) as { entries?: PageEntry[] };
  if (!Array.isArray(pages.entries)) throw new Error(`${pagesPath} does not contain entries.`);
  const previous = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, "utf8")) as { entries?: CoverEntry[] } : {};
  const byKey = new Map((previous.entries ?? []).map(entry => [keyFor(entry), entry]));
  const eligible = pages.entries.filter(entry => entry.status === "found" && entry.officialPage);
  const persist = (stoppedForBlocking: boolean): void => {
    const entries = eligible.map(page => byKey.get(keyFor(page)) ?? { ...page, status: "pending" as const });
    fs.writeFileSync(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), source: pagesPath, requestDelayMs: DELAY_MS, stoppedForBlocking, entries }, null, 2)}\n`);
  };
  let attempts = 0, consecutiveBlocks = 0, stoppedForBlocking = false;
  for (const page of eligible) {
    const previousEntry = byKey.get(keyFor(page));
    if (previousEntry?.status === "found" && !refresh) continue;
    if (attempts >= limit) break;
    if (attempts > 0) await sleep(DELAY_MS);
    attempts += 1;
    console.log(`Fetching ${page.runId} #${page.issue}`);
    try {
      const result = await fetchCover(page.officialPage!);
      consecutiveBlocks = result.status === 403 || result.status === 429 ? consecutiveBlocks + 1 : 0;
      const status = result.status === 403 || result.status === 429 ? "blocked" : result.status >= 400 ? "fetch-error" : result.cover ? "found" : "no-cover-found";
      byKey.set(keyFor(page), { ...page, status, sourceImageUrl: result.cover, cleanImageUrl: result.cover ? cleanVariant(result.cover) : undefined, extractedAt: new Date().toISOString(), error: result.status >= 400 ? `Marvel returned HTTP ${result.status}` : result.cover ? undefined : "No Marvel CDN cover URL found in page HTML" });
      persist(stoppedForBlocking);
      if (consecutiveBlocks >= BLOCK_THRESHOLD) { stoppedForBlocking = true; break; }
    } catch (error) { byKey.set(keyFor(page), { ...page, status: "fetch-error", extractedAt: new Date().toISOString(), error: error instanceof Error ? error.message : String(error) }); persist(stoppedForBlocking); }
  }
  const entries = eligible.map(page => byKey.get(keyFor(page)) ?? { ...page, status: "pending" as const });
  const inventory = { generatedAt: new Date().toISOString(), source: pagesPath, requestDelayMs: DELAY_MS, stoppedForBlocking, entries };
  fs.writeFileSync(outputPath, `${JSON.stringify(inventory, null, 2)}\n`);
  const counts = entries.reduce<Record<string, number>>((total, entry) => ({ ...total, [entry.status]: (total[entry.status] ?? 0) + 1 }), {});
  console.log(`Wrote ${outputPath}: ${JSON.stringify(counts)}${stoppedForBlocking ? " (stopped after repeated blocking)" : ""}`);
}
main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
