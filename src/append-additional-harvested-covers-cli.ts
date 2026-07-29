import fs from "node:fs";
import path from "node:path";
import { LabelConfig } from "./types";

const LABELS_PATH = path.join(process.cwd(), "config", "labels.json");
const COVERS_PATH = path.join(process.cwd(), "docs", "MARVEL-ADDITIONAL-COVER-URLS.json");
type Cover = { labelId: string; status: string; cleanImageUrl?: string };

function formatLabels(labels: LabelConfig[], lineEnding: string): string {
  return `${JSON.stringify(labels, null, 4).replace(/\[\n\s+(-?\d+(?:\.\d+)?),\n\s+(-?\d+(?:\.\d+)?)\n\s+\]/g, "[$1, $2]")}${lineEnding}`;
}
function valid(value: string | undefined): value is string {
  try { const url = new URL(value ?? ""); return url.hostname === "cdn.marvel.com" && /\/clean\.jpg$/i.test(url.pathname); } catch { return false; }
}
function main(): void {
  const args = process.argv.slice(2); const write = args.includes("--write");
  if (args.some(arg => arg !== "--write")) throw new Error("Usage: npm run append:additional-marvel-covers -- [--write]");
  const original = fs.readFileSync(LABELS_PATH, "utf8"); const labels = JSON.parse(original) as LabelConfig[];
  const inventory = JSON.parse(fs.readFileSync(COVERS_PATH, "utf8")) as { entries?: Cover[] };
  if (!Array.isArray(inventory.entries)) throw new Error(`${COVERS_PATH} does not contain entries.`);
  const byLabel = new Map<string, string[]>();
  for (const cover of inventory.entries) if (cover.status === "found") {
    if (!valid(cover.cleanImageUrl)) throw new Error(`Invalid clean Marvel JPEG for ${cover.labelId}.`);
    const urls = byLabel.get(cover.labelId) ?? []; urls.push(cover.cleanImageUrl); byLabel.set(cover.labelId, urls);
  }
  let touched = 0, additions = 0;
  for (const label of labels) {
    const harvested = byLabel.get(label.id); if (!harvested) continue;
    const options = [...(label.art.options ?? [])];
    if (!options.includes(label.art.asset)) options.unshift(label.art.asset);
    const next = [...options]; for (const url of harvested) if (!next.includes(url)) next.push(url);
    if (next.length !== options.length || !label.art.options) { label.art.options = next; touched += 1; additions += next.length - options.length; }
  }
  console.log(`${write ? "Appending" : "Would append"} ${additions} verified cover URL(s) across ${touched} label(s); selected assets are preserved.`);
  if (write) fs.writeFileSync(LABELS_PATH, formatLabels(labels, original.includes("\r\n") ? "\r\n" : "\n"));
}
main();
