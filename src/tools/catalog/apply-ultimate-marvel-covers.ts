import fs from "node:fs";
import path from "node:path";
import { LabelConfig } from "../../core/types";
import { writeCatalogJson } from "../../core/catalog-json";
import { isCleanMarvelJpegUrl } from "../../core/assets";

const LABELS_PATH = path.join(process.cwd(), "config", "labels.json");
const COVERS_PATH = path.join(process.cwd(), "docs", "research", "marvel", "MARVEL-ULTIMATE-COVER-URLS.json");
const TARGETS = new Set(["ultimate-001", "ultimate-spider-man-001", "ultimates-001"]);
type Cover = { labelId: string; status: string; cleanImageUrl?: string };

function main(): void {
  const args = process.argv.slice(2); const write = args.includes("--write");
  if (args.some(arg => arg !== "--write")) throw new Error("Usage: npm run apply:ultimate-marvel-covers -- [--write]");
  const original = fs.readFileSync(LABELS_PATH, "utf8"); const labels = JSON.parse(original) as LabelConfig[];
  const inventory = JSON.parse(fs.readFileSync(COVERS_PATH, "utf8")) as { entries?: Cover[] };
  if (!Array.isArray(inventory.entries)) throw new Error(`${COVERS_PATH} does not contain entries.`);
  const byLabel = new Map<string, string[]>();
  for (const cover of inventory.entries) if (cover.status === "found") {
    if (!isCleanMarvelJpegUrl(cover.cleanImageUrl)) throw new Error(`Invalid clean Marvel JPEG for ${cover.labelId}.`);
    const urls = byLabel.get(cover.labelId) ?? []; urls.push(cover.cleanImageUrl); byLabel.set(cover.labelId, urls);
  }
  let changed = 0;
  for (const label of labels) {
    if (!TARGETS.has(label.id)) continue;
    const urls = byLabel.get(label.id); if (!urls?.length) throw new Error(`No harvested Ultimate covers for ${label.id}.`);
    const asset = urls.includes(label.art.asset) ? label.art.asset : urls[0];
    const unchanged = label.art.asset === asset && label.art.options?.length === urls.length && label.art.options.every((url, index) => url === urls[index]);
    if (!unchanged) { label.art.asset = asset; label.art.options = urls; changed += 1; }
  }
  console.log(`${write ? "Applying" : "Would apply"} exact current-Ultimate cover lists to ${changed} label(s).`);
  if (write) writeCatalogJson(LABELS_PATH, labels);
}
main();
