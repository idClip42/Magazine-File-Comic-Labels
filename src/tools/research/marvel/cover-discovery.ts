export const MARVEL_BLOCK_THRESHOLD = 3;

const marvelHeaders = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.8",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
};

export function wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function canonicalMarvelImageUrl(value: string): string | undefined {
    try {
        const url = new URL(value.replace(/\\u002F/g, "/").replace(/\\\//g, "/"));
        if (url.hostname !== "cdn.marvel.com" || !/\.(?:jpe?g|png|webp)$/i.test(url.pathname)) return undefined;
        url.search = "";
        url.hash = "";
        return url.toString();
    } catch {
        return undefined;
    }
}

function coverScore(url: string): number {
    if (/\/portrait_uncanny\./i.test(url)) return 100;
    if (/\/clean\./i.test(url)) return 90;
    if (/\/portrait_incredible\./i.test(url)) return 80;
    return 0;
}

export function findMarvelCoverUrl(html: string): string | undefined {
    const decoded = html.replace(/\\u002F/g, "/").replace(/\\\//g, "/");
    const matches = [...decoded.matchAll(/https:\/\/cdn\.marvel\.com\/[^"'<>\\\s]+?\.(?:jpe?g|png|webp)/gi)]
        .map(match => canonicalMarvelImageUrl(match[0]))
        .filter((url): url is string => Boolean(url));
    return [...new Set(matches)].sort((left, right) => coverScore(right) - coverScore(left))[0];
}

/** Marvel's page preview has a confirmed same-path clean JPEG rendition. */
export function cleanMarvelCoverUrl(sourceImageUrl: string): string | undefined {
    const source = new URL(sourceImageUrl);
    if (!/\/portrait_uncanny\.(?:jpe?g|png|webp)$/i.test(source.pathname)) return undefined;
    source.pathname = source.pathname.replace(/portrait_uncanny\.(jpe?g|png|webp)$/i, "clean.jpg");
    return source.toString();
}

export async function fetchMarvelCover(pageUrl: string): Promise<{ cover?: string; status: number }> {
    const response = await fetch(pageUrl, {
        headers: marvelHeaders,
        signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) return { status: response.status };
    return { status: response.status, cover: findMarvelCoverUrl(await response.text()) };
}
