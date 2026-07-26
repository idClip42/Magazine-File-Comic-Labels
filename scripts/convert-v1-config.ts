import fs from "node:fs";
import path from "node:path";
import { CategoriesConfig, LabelConfig } from "../src/types";

type V1Subseries = {
  name?: string;
  volume?: number;
  issues?: { start: number; end: number };
  years?: { start: number; end: number };
};

type V1Box = {
  subseries: V1Subseries[];
  coverArt: string;
  coverArtTransform?: { top?: number; left?: number; zoom?: number };
};

type V1Series = {
  name: string;
  logo?: string;
  color: string;
  boxes: V1Box[];
};

type V1Config = { series: V1Series[] };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function categoryFor(seriesName: string): { id: string; displayName: string; logoKey: string } {
  const fantasticFour = seriesName.match(/^Fantastic Four(?: \((.+)\))?$/);
  if (fantasticFour) {
    const logoDescription = (fantasticFour[1] ?? "Classic Logo").replace(/\blogo\b/gi, "").trim();
    return { id: "fantastic-four", displayName: "Fantastic Four", logoKey: slugify(logoDescription) || "classic" };
  }

  return { id: slugify(seriesName), displayName: seriesName, logoKey: "default" };
}

function normalizeAsset(asset: string): string {
  const legacyLocalPrefix = "./../imgs/";
  return asset.startsWith(legacyLocalPrefix) ? asset.slice(legacyLocalPrefix.length) : asset;
}

function writeJson(fileName: string, value: unknown): void {
  const configDirectory = path.join(process.cwd(), "config");
  fs.mkdirSync(configDirectory, { recursive: true });
  fs.writeFileSync(path.join(configDirectory, fileName), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

const legacyPath = path.join(process.cwd(), "legacy", "v1", "config.json");
const legacy = JSON.parse(fs.readFileSync(legacyPath, "utf8")) as V1Config;
const categories: CategoriesConfig = {};
const labels: LabelConfig[] = [];
const labelCounts: Record<string, number> = {};

for (const series of legacy.series) {
  const identity = categoryFor(series.name);
  const existing = categories[identity.id];
  if (!existing) {
    categories[identity.id] = { name: identity.displayName, color: series.color, logos: {} };
  }

  const category = categories[identity.id];
  if (category.color !== series.color) {
    throw new Error(`Category ${identity.id} has inconsistent V1 colors: ${category.color} and ${series.color}.`);
  }
  if (!category.logos[identity.logoKey]) {
    if (!series.logo) throw new Error(`Series ${series.name} has no logo asset.`);
    category.logos[identity.logoKey] = { asset: normalizeAsset(series.logo) };
  }

  for (const box of series.boxes) {
    labelCounts[identity.id] = (labelCounts[identity.id] ?? 0) + 1;
    const transform = box.coverArtTransform;
    labels.push({
      id: `${identity.id}-${String(labelCounts[identity.id]).padStart(3, "0")}`,
      category: identity.id,
      logo: identity.logoKey,
      art: {
        asset: normalizeAsset(box.coverArt),
        crop: {
          focus: { x: 0.5, y: 0.5 },
          scale: transform?.zoom ?? 1,
          legacy: {
            topInches: transform?.top,
            leftInches: transform?.left,
            zoom: transform?.zoom
          }
        }
      },
      contents: box.subseries.map((subseries) => ({
        name: subseries.name,
        volume: subseries.volume,
        issues: subseries.issues ? [subseries.issues.start, subseries.issues.end] : undefined,
        years: subseries.years ? [subseries.years.start, subseries.years.end] : undefined
      }))
    });
  }
}

writeJson("categories.json", categories);
writeJson("labels.json", labels);
console.log(`Converted ${legacy.series.length} V1 series records into ${Object.keys(categories).length} categories and ${labels.length} labels.`);
