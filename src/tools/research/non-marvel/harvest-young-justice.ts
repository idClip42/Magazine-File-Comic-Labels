import fs from "node:fs";

const path = "docs/research/non-marvel/NON-MARVEL-COVER-URLS.json";
type Entry = { labelId: string; series: string; issue: string; status: string; imageUrl?: string; [key: string]: unknown };
async function main(): Promise<void> {
  const inventory = JSON.parse(fs.readFileSync(path, "utf8")) as { entries: Entry[] }; const now = new Date().toISOString();
  for (let issue = 47; issue <= 55; issue += 1) if (!inventory.entries.some(entry => entry.labelId === "young-justice-003" && entry.issue === String(issue))) inventory.entries.push({ labelId: "young-justice-003", series: "Young Justice (1998)", issue: String(issue), status: "pending" });
  for (const entry of inventory.entries) if (entry.labelId === "young-justice-001" || entry.labelId === "young-justice-002" || entry.labelId === "young-justice-003") {
    const imageUrl = `https://www.coverbrowser.com/image/young-justice/${entry.issue}-1.jpg`;
    const response = await fetch(imageUrl, { headers: { "User-Agent": "Mozilla/5.0 (compatible; ComicLabelsCoverResearch/1.0)" }, signal: AbortSignal.timeout(30_000) });
    if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error(`CoverBrowser did not return an image for Young Justice #${entry.issue}.`);
    entry.status = "found"; entry.imageUrl = imageUrl; entry.listingUrl = "https://www.coverbrowser.com/covers/young-justice"; entry.source = "CoverBrowser direct issue image"; entry.fetchedAt = now;
  }
  fs.writeFileSync(path, `${JSON.stringify({ generatedAt: now, source: "HipComic public listings with CoverBrowser Young Justice fallback", requestDelayMs: 500, entries: inventory.entries }, null, 2)}\n`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
