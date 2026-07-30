import fs from "node:fs";
const inventoryPath = "docs/NON-MARVEL-COVER-URLS.json";
const sleep = () => new Promise(resolve => setTimeout(resolve, 500));
type Entry = { labelId: string; issue: string; status: string; imageUrl?: string; [key: string]: unknown };
async function main(): Promise<void> {
  const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8")) as { entries: Entry[] }; let requests = 0;
  for (const entry of inventory.entries) if (entry.labelId.startsWith("teen-titans-go-")) {
    if (entry.source === "DC Fandom API cover metadata") continue;
    if (requests++) await sleep(); const page = `Teen_Titans_Go!_Vol_1_${entry.issue}`;
    const endpoint = `https://dc.fandom.com/api.php?action=parse&page=${encodeURIComponent(page)}&prop=text&format=json`;
    const response = await fetch(endpoint, { headers: { "User-Agent": "Mozilla/5.0 (compatible; ComicLabelsCoverResearch/1.0)" }, signal: AbortSignal.timeout(30_000) }); if (!response.ok) throw new Error(`Fandom returned HTTP ${response.status} for #${entry.issue}.`);
    const payload = await response.json() as { parse?: { text?: { "*"?: string } } }; const html = payload.parse?.text?.["*"] ?? "";
    const cover = [...html.matchAll(/https:\/\/static\.wikia\.nocookie\.net\/[^"' ]+Teen_Titans_Go(?:!|%21|&#33;)[^"' ]+\/revision\/latest\?cb=\d+/g)].map(match => match[0].replace(/&#33;/g, "%21")).find(url => !/Textless|scale-to-width/i.test(url));
    if (!cover) throw new Error(`No standard cover image found for Teen Titans Go #${entry.issue}.`);
    entry.status = "found"; entry.imageUrl = cover; entry.listingUrl = endpoint; entry.source = "DC Fandom API cover metadata"; entry.fetchedAt = new Date().toISOString(); fs.writeFileSync(inventoryPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), source: "HipComic, CoverBrowser, and Fandom API cover discovery", requestDelayMs: 500, entries: inventory.entries }, null, 2)}\n`);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
