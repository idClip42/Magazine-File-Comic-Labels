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
export function isCleanMarvelJpegUrl(
    value: string | undefined,
): value is string {
    if (!value) return false;
    try {
        const url = new URL(value);
        return (
            url.hostname === "cdn.marvel.com" &&
            /\/clean\.jpg$/i.test(url.pathname)
        );
    } catch {
        return false;
    }
}

/** Converts alternate Marvel CDN image formats to the committed JPEG convention. */
export function normalizeMarvelJpegUrl(value: string): string {
    try {
        const url = new URL(value);
        if (url.hostname === "cdn.marvel.com") {
            url.pathname = url.pathname.replace(
                /\.(?:webp|png|jpe?g)$/i,
                ".jpg",
            );
        }
        return url.toString();
    } catch {
        return value;
    }
}

/**
 * Validates a curator-supplied remote artwork URL. Marvel CDN previews are
 * deliberately stored as their clean JPEG rendition, never as WebP previews.
 */
export function normalizeManualArtworkUrl(value: string): string {
    let url: URL;
    try {
        url = new URL(value.trim());
    } catch {
        throw new Error("Enter a valid HTTP(S) cover URL.");
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Cover URLs must use HTTP or HTTPS.");
    }
    if (url.hostname === "cdn.marvel.com") {
        const slash = url.pathname.lastIndexOf("/");
        if (slash < 0) throw new Error("Enter a valid Marvel cover URL.");
        url.pathname = `${url.pathname.slice(0, slash + 1)}clean.jpg`;
        url.search = "";
        url.hash = "";
    }
    return url.toString();
}
