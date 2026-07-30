import type { LayoutConfig } from "./types";

/** True when an asset is fetched by the browser or local editor instead of read from the repository. */
export function isRemoteAsset(asset: string): boolean {
    return /^https?:\/\//i.test(asset);
}

/**
 * Resolves a configured asset for the self-contained Vite preview. Local
 * paths are relative to dist/v2; remote assets stay untouched.
 */
export function staticAssetUrl(layout: LayoutConfig, asset: string): string {
    if (isRemoteAsset(asset)) return asset;
    return `../../${layout.localAssetRoot}/${asset}`;
}

export function isMarvelCdnImage(asset: string): boolean {
    try {
        return new URL(asset).hostname === "cdn.marvel.com";
    } catch {
        return false;
    }
}

/** A harvested Marvel CDN cover that is suitable for the catalog. */
export function isCleanMarvelJpegUrl(value: string | undefined): value is string {
    if (!value) return false;
    try {
        const url = new URL(value);
        return url.hostname === "cdn.marvel.com" && /\/clean\.jpg$/i.test(url.pathname);
    } catch {
        return false;
    }
}

/** Converts alternate Marvel CDN image formats to the committed JPEG convention. */
export function normalizeMarvelJpegUrl(value: string): string {
    try {
        const url = new URL(value);
        if (url.hostname === "cdn.marvel.com") {
            url.pathname = url.pathname.replace(/\.(?:webp|png|jpe?g)$/i, ".jpg");
        }
        return url.toString();
    } catch {
        return value;
    }
}
