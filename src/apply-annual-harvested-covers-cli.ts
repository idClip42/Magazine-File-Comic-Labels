import fs from "node:fs";
import path from "node:path";
import { LabelConfig } from "./types";

const LABELS_PATH = path.join(process.cwd(), "config", "labels.json");
const COVERS_PATH = path.join(process.cwd(), "docs", "MARVEL-ANNUAL-COVER-URLS.json");
const DEDICATED_LABELS = new Set(["fantastic-four-001", "fantastic-four-002", "new-mutants-005", "x-men-annual"]);

type Cover = { labelId: string; issue: number; status: string; cleanImageUrl?: string };

function formatLabels(labels: LabelConfig[], lineEnding: string): string {
  return `${JSON.stringify(labels, null, 4).replace(/\[\n\s+(-?\d+(?:\.\d+)?),\n\s+(-?\d+(?:\.\d+)?)\n\s+\]/g, "[$1, $2]")}${lineEnding}`;
}
function valid(value: string | undefined): value is string {
  try { const url = new URL(value ?? ""); return url.hostname === "cdn.marvel.com" && /\/clean\.jpg$/i.test(url.pathname); } catch { return false; }
}
function selectedIssue(asset: string): number | undefined {
  return Number(asset.match(/annual_vol_\d+_(\d+)(?:\.jpg|$)/i)?.[1]) || undefined;
}
function main(): void {
  const args = process.argv.slice(2); const write = args.includes("--write");
  if (args.some(arg => arg !== "--write")) throw new Error("Usage: npm run apply:annual-marvel-covers -- [--write]");
  const original = fs.readFileSync(LABELS_PATH, "utf8"); const labels = JSON.parse(original) as LabelConfig[];
  const inventory = JSON.parse(fs.readFileSync(COVERS_PATH, "utf8")) as { entries?: Cover[] };
  if (!Array.isArray(inventory.entries)) throw new Error(`${COVERS_PATH} does not contain entries.`);
  const byLabel = new Map<string, Cover[]>();
  for (const cover of inventory.entries) if (cover.status === "found") {
    if (!valid(cover.cleanImageUrl)) throw new Error(`Invalid clean Marvel JPEG for ${cover.labelId}.`);
    const covers = byLabel.get(cover.labelId) ?? []; covers.push(cover); byLabel.set(cover.labelId, covers);
  }
  let changed = 0, added = 0;
  for (const label of labels) {
    const covers = byLabel.get(label.id); if (!covers) continue;
    const urls = covers.map(cover => cover.cleanImageUrl!);
    if (DEDICATED_LABELS.has(label.id)) {
      const matching = covers.find(cover => cover.issue === selectedIssue(label.art.asset))?.cleanImageUrl;
      const nextAsset = urls.includes(label.art.asset) ? label.art.asset : matching ?? urls[0];
      const unchanged = label.art.asset === nextAsset && label.art.options?.length === urls.length && label.art.options.every((url, index) => url === urls[index]);
      if (!unchanged) { label.art.asset = nextAsset; label.art.options = urls; changed += 1; added += urls.length; }
      continue;
    }
    const options = [...(label.art.options ?? [])]; if (!options.includes(label.art.asset)) options.unshift(label.art.asset);
    const next = [...options]; for (const url of urls) if (!next.includes(url)) next.push(url);
    if (next.length !== options.length || !label.art.options) { label.art.options = next; changed += 1; added += next.length - options.length; }
  }
  console.log(`${write ? "Applying" : "Would apply"} annual covers to ${changed} label(s) (${added} option entries); dedicated annual lists replace superseded candidates and mixed labels retain their selected covers.`);
  if (write) fs.writeFileSync(LABELS_PATH, formatLabels(labels, original.includes("\r\n") ? "\r\n" : "\n"));
}
main();
