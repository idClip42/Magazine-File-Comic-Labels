import {
    CategoriesConfig,
    EditorConfig,
    LabelConfig,
    LayoutConfig,
} from "../core/types";
import { PreparedLogos } from "./logo-prep";
import { staticAssetUrl } from "../core/assets";

/**
 * Resolves an asset from the generated document back to the project root.
 * A browser served by the local editor also accepts this path for local logos.
 */
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
