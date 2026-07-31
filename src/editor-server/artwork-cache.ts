import chalk from "chalk";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const outputDirectory = path.join(process.cwd(), "dist", "v2");
export const legacyArtworkCacheDirectory = path.join(
    process.cwd(),
    "dist",
    "artwork-cache",
);
export const artworkCacheDirectory = path.join(
    process.cwd(),
    ".cache",
    "artwork",
);
const artworkCacheImagesDirectory = path.join(artworkCacheDirectory, "images");
const artworkCacheIndexPath = path.join(artworkCacheDirectory, "index.json");
const artworkCacheFormat = "source-format-v1";

export type CachedImage = { body: Buffer; contentType: string };
type ArtworkCacheEntry = {
    contentType: string;
    file: string;
    format: string;
    source: string;
};
type ArtworkCacheIndex = Record<string, ArtworkCacheEntry>;

/**
 * The old cache lived inside dist/, which made generated output persistent by
 * accident. Move it wholesale on the same drive before Vite can clean dist.
 */
export function migrateLegacyArtworkCache():
    | "migrated"
    | "already-migrated"
    | "not-found" {
    if (fs.existsSync(artworkCacheDirectory)) return "already-migrated";
    if (!fs.existsSync(legacyArtworkCacheDirectory)) return "not-found";

    fs.mkdirSync(path.dirname(artworkCacheDirectory), { recursive: true });
    fs.renameSync(legacyArtworkCacheDirectory, artworkCacheDirectory);
    return "migrated";
}

function isArtworkCacheEntry(value: unknown): value is ArtworkCacheEntry {
    return (
        !!value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        typeof (value as ArtworkCacheEntry).source === "string" &&
        typeof (value as ArtworkCacheEntry).file === "string" &&
        typeof (value as ArtworkCacheEntry).format === "string" &&
        typeof (value as ArtworkCacheEntry).contentType === "string"
    );
}

function readArtworkCacheIndex(): ArtworkCacheIndex {
    try {
        const parsed: unknown = JSON.parse(
            fs.readFileSync(artworkCacheIndexPath, "utf8"),
        );
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
            return {};
        return Object.fromEntries(
            Object.entries(parsed).filter(([, entry]) =>
                isArtworkCacheEntry(entry),
            ),
        ) as ArtworkCacheIndex;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            console.warn(
                chalk.yellow(
                    `Ignoring unreadable artwork cache index: ${error instanceof Error ? error.message : "Unknown error"}`,
                ),
            );
        }
        return {};
    }
}

const artworkCacheIndex = readArtworkCacheIndex();
export const imageCache = new Map<string, CachedImage>();

function writeArtworkCacheIndex(): void {
    fs.mkdirSync(artworkCacheDirectory, { recursive: true });
    const temporaryPath = `${artworkCacheIndexPath}.tmp`;
    fs.writeFileSync(
        temporaryPath,
        `${JSON.stringify(artworkCacheIndex, null, 2)}\n`,
        "utf8",
    );
    fs.renameSync(temporaryPath, artworkCacheIndexPath);
}

function extensionForImage(contentType: string, asset: string): string {
    const extensionForType: Record<string, string> = {
        "image/avif": ".avif",
        "image/gif": ".gif",
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/svg+xml": ".svg",
        "image/webp": ".webp",
    };
    const sourceExtension = path.extname(new URL(asset).pathname).toLowerCase();
    return extensionForType[contentType] ?? (sourceExtension || ".img");
}

function cachedArtworkPath(entry: ArtworkCacheEntry): string | undefined {
    const filePath = path.resolve(artworkCacheDirectory, entry.file);
    return filePath.startsWith(`${artworkCacheDirectory}${path.sep}`)
        ? filePath
        : undefined;
}

export async function loadArtworkFromDiskCache(
    asset: string,
): Promise<boolean> {
    const entry = artworkCacheIndex[asset];
    if (!entry || entry.source !== asset || entry.format !== artworkCacheFormat)
        return false;
    const filePath = cachedArtworkPath(entry);
    if (!filePath) return false;
    try {
        imageCache.set(asset, {
            body: await fs.promises.readFile(filePath),
            contentType: entry.contentType,
        });
        return true;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            console.warn(
                chalk.yellow(
                    `Could not read cached artwork for ${asset}: ${error instanceof Error ? error.message : "Unknown error"}`,
                ),
            );
        }
        return false;
    }
}

export function saveArtworkToDiskCache(
    asset: string,
    image: CachedImage,
): void {
    fs.mkdirSync(artworkCacheImagesDirectory, { recursive: true });
    const digest = crypto.createHash("sha256").update(asset).digest("hex");
    const file = `images/${digest}${extensionForImage(image.contentType, asset)}`;
    const filePath = path.join(artworkCacheDirectory, file);
    const previousPath =
        artworkCacheIndex[asset] && cachedArtworkPath(artworkCacheIndex[asset]);
    fs.writeFileSync(filePath, image.body);
    artworkCacheIndex[asset] = {
        source: asset,
        file,
        contentType: image.contentType,
        format: artworkCacheFormat,
    };
    writeArtworkCacheIndex();
    if (
        previousPath &&
        previousPath !== filePath &&
        fs.existsSync(previousPath)
    ) {
        fs.unlinkSync(previousPath);
    }
}
