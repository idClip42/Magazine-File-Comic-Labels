import fs from "node:fs";
import path from "node:path";
import { isRemoteAsset } from "./assets";
import { CategoriesConfig, LabelConfig, LayoutConfig } from "./types";

export function auditAssets(
    layout: LayoutConfig,
    categories: CategoriesConfig,
    labels: LabelConfig[],
): string[] {
    const missing: string[] = [];

    for (const [categoryId, category] of Object.entries(categories)) {
        for (const [logoId, logo] of Object.entries(category.logos)) {
            if (isRemoteAsset(logo.asset)) continue;
            const assetPath = path.join(
                process.cwd(),
                layout.localAssetRoot,
                logo.asset,
            );
            if (!fs.existsSync(assetPath)) {
                missing.push(
                    `category ${categoryId}, logo ${logoId}: ${logo.asset}`,
                );
            }
        }
    }

    for (const label of labels) {
        const artworkAssets = [label.art.asset, ...(label.art.options ?? [])];
        for (const asset of new Set(artworkAssets)) {
            if (isRemoteAsset(asset)) continue;
            const assetPath = path.join(
                process.cwd(),
                layout.localAssetRoot,
                asset,
            );
            if (!fs.existsSync(assetPath)) {
                missing.push(`label ${label.id}, artwork: ${asset}`);
            }
        }
    }

    return missing;
}
