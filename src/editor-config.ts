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
    artworkUrlForLabel: (label: LabelConfig) => string = label =>
        staticAssetUrl(layout, label.art.asset),
): EditorConfig {
    return {
        layout,
        categories,
        labels,
        preparedLogos: Object.fromEntries(preparedLogos),
        artworkUrls: Object.fromEntries(
            labels.map(label => [label.id, artworkUrlForLabel(label)]),
        ),
    };
}
