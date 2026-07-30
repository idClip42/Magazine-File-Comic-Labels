import fs from "node:fs";
import path from "node:path";
import { LabelConfig } from "../../core/types";
import { writeCatalogJson } from "../../core/catalog-json";

const labelsPath = path.join(process.cwd(), "config", "labels.json");
const coversPath = path.join(process.cwd(), "docs", "research", "non-marvel", "NON-MARVEL-COVER-URLS.json");
type Cover = { labelId: string; issue: string; status: string; imageUrl?: string };
function main(): void {
  const write = process.argv.slice(2).includes("--write"); if (process.argv.slice(2).some(arg => arg !== "--write")) throw new Error("Usage: npm run apply:non-marvel-covers -- [--write]");
  const original = fs.readFileSync(labelsPath, "utf8"); const labels = JSON.parse(original) as LabelConfig[];
  const covers = JSON.parse(fs.readFileSync(coversPath, "utf8")) as { entries?: Cover[] }; if (!Array.isArray(covers.entries)) throw new Error("Cover inventory has no entries.");
  const byLabel = new Map<string, Cover[]>(); for (const cover of covers.entries) if (cover.status === "found" && cover.imageUrl) { const values = byLabel.get(cover.labelId) ?? []; if (!values.some(value => value.imageUrl === cover.imageUrl)) values.push(cover); byLabel.set(cover.labelId, values); }
  let changed = 0; for (const label of labels) { const coversForLabel = byLabel.get(label.id); if (!coversForLabel) continue; const urls = coversForLabel.map(cover => cover.imageUrl!); if (label.id.startsWith("young-justice-") || label.id.startsWith("teen-titans-go-")) { const selected = Number(label.art.asset.match(/Young_Justice(?:_Vol_1)?_(\d+)/i)?.[1]) || (label.art.asset.includes("Demo_pg_1") ? 1 : undefined); const nextAsset = coversForLabel.find(cover => Number(cover.issue) === selected)?.imageUrl ?? urls[0]; if (label.art.asset !== nextAsset || !label.art.options || label.art.options.some((url, index) => url !== urls[index])) { label.art.asset = nextAsset; label.art.options = urls; changed += 1; } continue; } const options = [...(label.art.options ?? [])]; if (!options.includes(label.art.asset)) options.unshift(label.art.asset); for (const url of urls) if (!options.includes(url)) options.push(url); if (!label.art.options || options.length !== label.art.options.length) { label.art.options = options; changed += 1; } }
  console.log(`${write ? "Applying" : "Would apply"} verified non-Marvel cover options to ${changed} label(s).`); if (write) writeCatalogJson(labelsPath, labels);
}
main();
