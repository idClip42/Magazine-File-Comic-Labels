import fs from "node:fs";
import path from "node:path";
import { CategoriesConfig, LabelConfig, LayoutConfig } from "./types";

function isRemoteAsset(asset: string): boolean {
  return /^https?:\/\//i.test(asset);
}

export function auditAssets(
  layout: LayoutConfig,
  categories: CategoriesConfig,
  labels: LabelConfig[]
): string[] {
  const missing: string[] = [];

  for (const [categoryId, category] of Object.entries(categories)) {
    for (const [logoId, logo] of Object.entries(category.logos)) {
      if (isRemoteAsset(logo.asset)) continue;
      const assetPath = path.join(process.cwd(), layout.localAssetRoot, logo.asset);
      if (!fs.existsSync(assetPath)) {
        missing.push(`category ${categoryId}, logo ${logoId}: ${logo.asset}`);
      }
    }
  }

  for (const label of labels) {
    if (isRemoteAsset(label.art.asset)) continue;
    const assetPath = path.join(process.cwd(), layout.localAssetRoot, label.art.asset);
    if (!fs.existsSync(assetPath)) {
      missing.push(`label ${label.id}, artwork: ${label.art.asset}`);
    }
  }

  return missing;
}
