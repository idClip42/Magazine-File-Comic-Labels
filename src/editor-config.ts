import {
    CategoriesConfig,
    EditorConfig,
    LabelConfig,
    LayoutConfig,
} from "./types";
import { PreparedLogos } from "./logo-prep";

function isRemoteAsset(asset: string): boolean {
    return /^https?:\/\//i.test(asset);
}

/**
 * Resolves an asset from the generated document back to the project root.
 * A browser served by the local editor also accepts this path for local logos.
 */
export function staticAssetUrl(layout: LayoutConfig, asset: string): string {
    if (isRemoteAsset(asset)) return asset;
    return `../../${layout.localAssetRoot}/${asset}`;
}

export function buildEditorConfig(
    layout: LayoutConfig,
    categories: CategoriesConfig,
    labels: LabelConfig[],
    preparedLogos: PreparedLogos,
    artworkUrlForAsset: (asset: string) => string = asset => staticAssetUrl(layout, asset),
): EditorConfig {
    const artworkAssets = [...new Set(labels.flatMap(label => [
        label.art.asset,
        ...(label.art.options ?? []),
    ]))];
    return {
        layout,
        categories,
        labels,
        preparedLogos: Object.fromEntries(preparedLogos),
        artworkUrls: Object.fromEntries(
            artworkAssets.map(asset => [asset, artworkUrlForAsset(asset)]),
        ),
    };
}
