import fs from "node:fs";

const OUT = "docs/NON-MARVEL-COVER-URLS.json";
const DELAY = 500;
type Target = { labelId: string; series: string; issue: string; query: string };
type Entry = Target & { status: "pending" | "found" | "not-found" | "fetch-error" | "blocked"; listingUrl?: string; imageUrl?: string; error?: string; fetchedAt?: string };
const range = (labelId: string, series: string, title: string, from: number, to: number): Target[] => Array.from({ length: to - from + 1 }, (_, index) => ({ labelId, series, issue: String(from + index), query: `${title} ${from + index}` }));
const targets: Target[] = [
  ...range("teen-titans-go-001", "Teen Titans Go! (2004)", "Teen Titans Go 2004", 1, 28),
  ...range("teen-titans-go-002", "Teen Titans Go! (2004)", "Teen Titans Go 2004", 29, 55),
  ...range("young-justice-001", "Young Justice (1998)", "Young Justice 1998", 1, 22),
  ...range("young-justice-002", "Young Justice (1998)", "Young Justice 1998", 23, 46),
  ...range("jonny-quest-001", "Jonny Quest (1986)", "Jonny Quest 1986", 1, 31),
  ...range("fatale-001", "Fatale (2012)", "Fatale 2012 Image Comics", 1, 24),
  ...range("indiana-jones-003", "Indiana Jones and the Fate of Atlantis", "Indiana Jones Fate Atlantis", 1, 4),
  ...range("indiana-jones-003", "The Young Indiana Jones Chronicles", "Young Indiana Jones Chronicles 1992", 1, 12),
  ...range("indiana-jones-003", "Indiana Jones: Thunder in the Orient", "Indiana Jones Thunder Orient", 1, 6),
  ...range("indiana-jones-003", "Indiana Jones and the Golden Fleece", "Indiana Jones Golden Fleece", 1, 2),
  ...range("indiana-jones-003", "Indiana Jones and the Arms of Gold", "Indiana Jones Arms Gold", 1, 4),
  ...range("indiana-jones-004", "Indiana Jones and the Iron Phoenix", "Indiana Jones Iron Phoenix", 1, 4),
  ...range("indiana-jones-004", "Indiana Jones and the Spear of Destiny", "Indiana Jones Spear Destiny", 1, 4),
  ...range("indiana-jones-004", "Indiana Jones and the Sargasso Pirates", "Indiana Jones Sargasso Pirates", 1, 4),
  ...range("indiana-jones-004", "Indiana Jones and the Kingdom of the Crystal Skull", "Indiana Jones Kingdom Crystal Skull", 1, 2),
  ...range("indiana-jones-004", "Indiana Jones and the Tomb of the Gods", "Indiana Jones Tomb Gods", 1, 4)
];
const key = (entry: Pick<Target, "labelId" | "series" | "issue">) => `${entry.labelId}|${entry.series}|${entry.issue}`;
const sleep = () => new Promise(resolve => setTimeout(resolve, DELAY));
const headers = { "User-Agent": "Mozilla/5.0 (compatible; ComicLabelsCoverResearch/1.0)", Accept: "text/html" };
function listingUrls(html: string): string[] { return [...new Set([...html.matchAll(/href="(\/listing\/[^"]+)"/g)].map(m => `https://www.hipcomic.com${m[1]}`))]; }
function imageUrl(html: string): string | undefined { return html.match(/https:\/\/img\.hipcomic\.com\/p\/[a-f0-9]+\.jpg/)?.[0]; }
async function fetchText(url: string): Promise<{ status: number; text: string }> { const response = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) }); return { status: response.status, text: await response.text() }; }
function persist(entries: Entry[]): void { fs.writeFileSync(OUT, `${JSON.stringify({ generatedAt: new Date().toISOString(), source: "HipComic public listing pages", requestDelayMs: DELAY, entries }, null, 2)}\n`); }
async function main(): Promise<void> {
  const refresh = process.argv.slice(2).includes("--refresh"); if (process.argv.slice(2).some(arg => arg !== "--refresh")) throw new Error("Usage: npm run harvest:non-marvel-covers [-- --refresh]");
  const existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) as { entries?: Entry[] } : {}; const previous = new Map((existing.entries ?? []).map(entry => [key(entry), entry]));
  const entries: Entry[] = [];
  for (const target of targets) {
    const old = previous.get(key(target)); if (old && !refresh) { entries.push(old); continue; }
    if (entries.length || old) await sleep();
    try {
      const search = await fetchText(`https://www.hipcomic.com/search?keywords=${encodeURIComponent(target.query)}`);
      if (search.status === 403 || search.status === 429) { entries.push({ ...target, status: "blocked", error: `HipComic returned HTTP ${search.status}`, fetchedAt: new Date().toISOString() }); persist(entries); break; }
      const candidates = listingUrls(search.text); let found: Entry | undefined;
      for (const listingUrl of candidates.slice(0, 12)) {
        await sleep(); const detail = await fetchText(listingUrl); const image = imageUrl(detail.text);
        if (detail.status === 403 || detail.status === 429) { found = { ...target, status: "blocked", listingUrl, error: `HipComic returned HTTP ${detail.status}`, fetchedAt: new Date().toISOString() }; break; }
        if (image && new RegExp(`(?:^|[^0-9])${target.issue}(?:[^0-9]|$)`).test(listingUrl)) { found = { ...target, status: "found", listingUrl, imageUrl: image, fetchedAt: new Date().toISOString() }; break; }
      }
      entries.push(found ?? { ...target, status: "not-found", error: candidates.length ? "No matching listing with a cover image" : "No HipComic listings found", fetchedAt: new Date().toISOString() });
    } catch (error) { entries.push({ ...target, status: "fetch-error", error: error instanceof Error ? error.message : String(error), fetchedAt: new Date().toISOString() }); }
    persist(entries); if (entries[entries.length - 1]?.status === "blocked") break;
  }
  persist(entries); const counts = entries.reduce<Record<string, number>>((all, entry) => ({ ...all, [entry.status]: (all[entry.status] ?? 0) + 1 }), {}); console.log(JSON.stringify(counts));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
