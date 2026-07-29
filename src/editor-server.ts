import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import crypto from "node:crypto";
import chalk from "chalk";
import { categories, labels, layout } from "./config";
import { buildEditorConfig } from "./editor-config";
import { CROP_SCALE_MAX, CROP_SCALE_MIN } from "./crop";
import { prepareLogos } from "./logo-prep";
import { ArtCrop, ArtTreatment, LabelConfig, LayoutConfig } from "./types";

const host = "127.0.0.1";
const port = Number(process.env.CROP_EDITOR_PORT ?? 4173);
const labelsPath = path.join(process.cwd(), "config", "labels.json");
const layoutPath = path.join(process.cwd(), "config", "layout.json");
const outputDirectory = path.join(process.cwd(), "dist", "v2");
const artworkCacheDirectory = path.join(process.cwd(), "dist", "artwork-cache");
const artworkCacheImagesDirectory = path.join(artworkCacheDirectory, "images");
const artworkCacheIndexPath = path.join(artworkCacheDirectory, "index.json");
const artworkCacheFormat = "source-format-v1";
const maxRequestBytes = 1024 * 1024;
const preloadConcurrency = 12;
const preloadProgressInterval = 10;
const slowPreloadThresholdMilliseconds = 2_000;
const imageTypes: Record<string, string> = {
    ".avif": "image/avif",
    ".gif": "image/gif",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
};
const applicationTypes: Record<string, string> = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".map": "application/json; charset=utf-8",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
};

type CropUpdate = Pick<ArtCrop, "focus" | "scale">;
type ArtUpdate = {
    asset: string;
    crop: CropUpdate;
};
type LayoutUpdate = {
    artTreatment?: ArtTreatment;
    identityBandHeightInches?: number;
    metadataBandHeightInches?: number;
    typography?: LayoutConfig["typography"];
    logoPalette?: LayoutConfig["logoPalette"];
    logoOutline?: LayoutConfig["logoOutline"];
};

type EditorUpdates = {
    arts?: Record<string, ArtUpdate>;
    layout?: LayoutUpdate;
};
type CachedImage = { body: Buffer; contentType: string };
type ArtworkCacheEntry = {
    contentType: string;
    file: string;
    format: string;
    source: string;
};
type ArtworkCacheIndex = Record<string, ArtworkCacheEntry>;

const labelById = new Map(labels.map(label => [label.id, label]));
const configuredArtworkAssets = new Set(labels.flatMap(label => [
    label.art.asset,
    ...(label.art.options ?? []),
]));
const imageCache = new Map<string, CachedImage>();
const preparedLogos = prepareLogos(layout, categories, outputDirectory);

function isArtworkCacheEntry(value: unknown): value is ArtworkCacheEntry {
    return !!value
        && typeof value === "object"
        && !Array.isArray(value)
        && typeof (value as ArtworkCacheEntry).source === "string"
        && typeof (value as ArtworkCacheEntry).file === "string"
        && typeof (value as ArtworkCacheEntry).format === "string"
        && typeof (value as ArtworkCacheEntry).contentType === "string";
}

function readArtworkCacheIndex(): ArtworkCacheIndex {
    try {
        const parsed: unknown = JSON.parse(fs.readFileSync(artworkCacheIndexPath, "utf8"));
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
        return Object.fromEntries(
            Object.entries(parsed).filter(([, entry]) => isArtworkCacheEntry(entry)),
        ) as ArtworkCacheIndex;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            console.warn(chalk.yellow(`Ignoring unreadable artwork cache index: ${error instanceof Error ? error.message : "Unknown error"}`));
        }
        return {};
    }
}

const artworkCacheIndex = readArtworkCacheIndex();

function writeArtworkCacheIndex(): void {
    fs.mkdirSync(artworkCacheDirectory, { recursive: true });
    const temporaryPath = `${artworkCacheIndexPath}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(artworkCacheIndex, null, 2)}\n`, "utf8");
    fs.renameSync(temporaryPath, artworkCacheIndexPath);
}

function sendJson(response: http.ServerResponse, status: number, body: object): void {
    response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(body));
}

function imageTypeForPath(filePath: string): string | undefined {
    return imageTypes[path.extname(filePath).toLowerCase()];
}

function isRemoteImage(asset: string): boolean {
    return /^https?:\/\//i.test(asset);
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
    return filePath.startsWith(`${artworkCacheDirectory}${path.sep}`) ? filePath : undefined;
}

async function loadArtworkFromDiskCache(asset: string): Promise<boolean> {
    const entry = artworkCacheIndex[asset];
    if (!entry || entry.source !== asset || entry.format !== artworkCacheFormat) return false;
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
            console.warn(chalk.yellow(`Could not read cached artwork for ${asset}: ${error instanceof Error ? error.message : "Unknown error"}`));
        }
        return false;
    }
}

function saveArtworkToDiskCache(asset: string, image: CachedImage): void {
    fs.mkdirSync(artworkCacheImagesDirectory, { recursive: true });
    const digest = crypto.createHash("sha256").update(asset).digest("hex");
    const file = `images/${digest}${extensionForImage(image.contentType, asset)}`;
    const previousPath = artworkCacheIndex[asset] && cachedArtworkPath(artworkCacheIndex[asset]);
    const filePath = path.join(artworkCacheDirectory, file);
    fs.writeFileSync(filePath, image.body);
    artworkCacheIndex[asset] = {
        source: asset,
        file,
        contentType: image.contentType,
        format: artworkCacheFormat,
    };
    writeArtworkCacheIndex();
    if (previousPath && previousPath !== filePath && fs.existsSync(previousPath)) {
        fs.unlinkSync(previousPath);
    }
}

function isCropUpdate(value: unknown): value is CropUpdate {
    if (!value || typeof value !== "object") return false;
    const crop = value as CropUpdate;
    return Number.isFinite(crop.focus?.x) && Number.isFinite(crop.focus?.y)
        && Number.isFinite(crop.scale)
        && crop.focus.x >= 0 && crop.focus.x <= 1
        && crop.focus.y >= 0 && crop.focus.y <= 1
        && crop.scale >= CROP_SCALE_MIN && crop.scale <= CROP_SCALE_MAX;
}

function isArtUpdate(value: unknown): value is ArtUpdate {
    return !!value && typeof value === "object"
        && typeof (value as ArtUpdate).asset === "string"
        && isCropUpdate((value as ArtUpdate).crop);
}

function isIdentityBandHeight(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value)
        && value >= 0.5 && value <= 3.5;
}

function isMetadataBandHeight(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value)
        && value >= 0.5 && value <= 2;
}

function isArtTreatment(value: unknown): value is ArtTreatment {
    if (!value || typeof value !== "object") return false;
    const treatment = value as ArtTreatment;
    return Number.isFinite(treatment.saturation) && treatment.saturation >= 0 && treatment.saturation <= 1
        && Number.isFinite(treatment.contrast) && treatment.contrast >= 0.5 && treatment.contrast <= 1.5
        && Number.isFinite(treatment.brightness) && treatment.brightness >= 0.5 && treatment.brightness <= 1.5
        && Number.isFinite(treatment.tintOpacity) && treatment.tintOpacity >= 0 && treatment.tintOpacity <= 1
        && ["color", "multiply", "overlay", "soft-light"].includes(treatment.tintBlendMode);
}

function isTypography(value: unknown): value is LayoutConfig["typography"] {
    if (!value || typeof value !== "object") return false;
    const typography = value as LayoutConfig["typography"];
    return Number.isFinite(typography.yearsSizeInches) && typography.yearsSizeInches >= 0.15 && typography.yearsSizeInches <= 0.5
        && Number.isFinite(typography.metadataSizeInches) && typography.metadataSizeInches >= 0.08 && typography.metadataSizeInches <= 0.25
        && Number.isFinite(typography.bandGapInches) && typography.bandGapInches >= 0 && typography.bandGapInches <= 0.15;
}

function isLogoPalette(value: unknown): value is LayoutConfig["logoPalette"] {
    return !!value && typeof value === "object"
        && Number.isFinite((value as LayoutConfig["logoPalette"]).mutedSaturationMultiplier)
        && (value as LayoutConfig["logoPalette"]).mutedSaturationMultiplier >= 0
        && (value as LayoutConfig["logoPalette"]).mutedSaturationMultiplier <= 1;
}

function isLogoOutline(value: unknown): value is LayoutConfig["logoOutline"] {
    if (!value || typeof value !== "object") return false;
    const outline = value as LayoutConfig["logoOutline"];
    return typeof outline.enabled === "boolean"
        && /^#[0-9a-f]{6}$/i.test(outline.color)
        && Number.isInteger(outline.widthPixels) && outline.widthPixels >= 0 && outline.widthPixels <= 6
        && ["round", "miter", "bevel"].includes(outline.lineJoin);
}

function validateLayoutUpdate(update: LayoutUpdate): void {
    if (!update || typeof update !== "object" || Array.isArray(update)) {
        throw new Error("Expected layout changes to be an object.");
    }
    const allowedFields = new Set([
        "artTreatment",
        "identityBandHeightInches",
        "metadataBandHeightInches",
        "typography",
        "logoPalette",
        "logoOutline",
    ]);
    if (Object.keys(update).some(key => !allowedFields.has(key))) {
        throw new Error("The requested layout setting cannot be edited here.");
    }
    if (Object.keys(update).length === 0) {
        throw new Error("Expected at least one layout change.");
    }
    if (update.artTreatment !== undefined && !isArtTreatment(update.artTreatment)) {
        throw new Error("Art-treatment values are outside their allowed ranges.");
    }
    if (update.identityBandHeightInches !== undefined && !isIdentityBandHeight(update.identityBandHeightInches)) {
        throw new Error("Identity-band height must be between 0.5 and 3.5 inches.");
    }
    if (update.metadataBandHeightInches !== undefined && !isMetadataBandHeight(update.metadataBandHeightInches)) {
        throw new Error("Metadata-band height must be between 0.5 and 2 inches.");
    }
    if (update.typography !== undefined && !isTypography(update.typography)) {
        throw new Error("Typography values are outside their allowed ranges.");
    }
    if (update.logoPalette !== undefined && !isLogoPalette(update.logoPalette)) {
        throw new Error("Muted-logo saturation must be between 0 and 1.");
    }
    if (update.logoOutline !== undefined && !isLogoOutline(update.logoOutline)) {
        throw new Error("Logo-outline values are outside their allowed ranges.");
    }
}

function formatLabels(configuredLabels: LabelConfig[], lineEnding: string): string {
    const expanded = JSON.stringify(configuredLabels, null, 4);
    const compactRanges = expanded.replace(
        /\[\n\s+(-?\d+(?:\.\d+)?),\n\s+(-?\d+(?:\.\d+)?)\n\s+\]/g,
        "[$1, $2]",
    );
    return `${compactRanges}${lineEnding}`;
}

async function downloadRemoteImage(asset: string): Promise<void> {
    const response = await fetch(asset, {
        headers: { Accept: "image/jpeg,image/png,image/gif,image/svg+xml,*/*;q=0.8" },
        signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

    const contentType = response.headers.get("content-type")?.split(";", 1)[0]
        ?? imageTypeForPath(asset)
        ?? "application/octet-stream";
    const image = {
        body: Buffer.from(await response.arrayBuffer()),
        contentType,
    };
    imageCache.set(asset, image);
    saveArtworkToDiskCache(asset, image);
}

async function preloadRemoteImages(): Promise<void> {
    const preloadStartedAt = performance.now();
    const assets = [...configuredArtworkAssets].filter(isRemoteImage);
    const failures: string[] = [];
    let downloads = 0;
    let nextIndex = 0;
    let completed = 0;

    const diskLoadResults = await Promise.all(assets.map(async asset => ({
        asset,
        loaded: await loadArtworkFromDiskCache(asset),
    })));
    const assetsToDownload = diskLoadResults
        .filter(result => !result.loaded)
        .map(result => result.asset);
    const diskCacheHits = assets.length - assetsToDownload.length;

    if (diskCacheHits > 0) {
        console.log(chalk.blue(`Art disk cache: ${diskCacheHits}/${assets.length} loaded concurrently.`));
    }

    console.log(chalk.cyan(`Preloading ${assets.length} remote art image(s)…`));

    const worker = async () => {
        while (nextIndex < assetsToDownload.length) {
            const asset = assetsToDownload[nextIndex++];
            const startedAt = performance.now();
            try {
                await downloadRemoteImage(asset);
                downloads += 1;
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                failures.push(`${asset} (${message})`);
            } finally {
                const elapsedMilliseconds = performance.now() - startedAt;
                if (elapsedMilliseconds >= slowPreloadThresholdMilliseconds) {
                    const outcome = imageCache.has(asset) ? "cached" : "failed";
                    console.log(chalk.yellow(`Slow art download (${outcome}, ${(elapsedMilliseconds / 1000).toFixed(1)}s): ${asset}`));
                }
                completed += 1;
                if (completed % preloadProgressInterval === 0 || completed === assetsToDownload.length) {
                    console.log(chalk.blue(`Art download: ${completed}/${assetsToDownload.length} complete (${downloads} cached, ${failures.length} failed).`));
                }
            }
        }
    };

    await Promise.all(Array.from({ length: Math.min(preloadConcurrency, assetsToDownload.length) }, worker));
    const megabytes = [...imageCache.values()].reduce((total, image) => total + image.body.length, 0) / 1024 / 1024;
    const elapsedSeconds = (performance.now() - preloadStartedAt) / 1000;
    const summary = `Preloaded ${imageCache.size}/${assets.length} remote art image(s) (${diskCacheHits} from disk, ${downloads} downloaded; ${megabytes.toFixed(1)} MB in memory) in ${elapsedSeconds.toFixed(1)}s.`;
    console.log(failures.length > 0 ? chalk.yellow(summary) : chalk.green(summary));
    if (failures.length > 0) {
        const examples = failures.slice(0, 3).join("; ");
        const remainder = failures.length > 3 ? ` (${failures.length - 3} more)` : "";
        console.warn(chalk.red(`Could not preload ${failures.length} art image(s): ${examples}${remainder}`));
    }
}

function serveArtwork(request: http.IncomingMessage, response: http.ServerResponse): boolean {
    if (request.method !== "GET" || !request.url?.startsWith("/art/")) return false;
    const asset = decodeURIComponent(request.url.slice("/art/".length).split("?", 1)[0]);
    if (!configuredArtworkAssets.has(asset)) {
        sendJson(response, 404, { error: "Unknown artwork." });
        return true;
    }

    if (isRemoteImage(asset)) {
        const image = imageCache.get(asset);
        if (!image) {
            sendJson(response, 503, { error: "Artwork was not available when the editor started." });
            return true;
        }
        response.writeHead(200, { "Content-Type": image.contentType, "Cache-Control": "no-store" });
        response.end(image.body);
        return true;
    }

    const projectRoot = process.cwd();
    const filePath = path.resolve(projectRoot, layout.localAssetRoot, asset);
    const contentType = imageTypeForPath(filePath);
    if (!contentType || !filePath.startsWith(`${projectRoot}${path.sep}`) || !fs.existsSync(filePath)) {
        sendJson(response, 404, { error: "Local artwork is unavailable." });
        return true;
    }
    response.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store" });
    fs.createReadStream(filePath).pipe(response);
    return true;
}

/** Serves the single compiled Vue application and its Vite-generated assets. */
function serveApplicationFile(request: http.IncomingMessage, response: http.ServerResponse): boolean {
    if (request.method !== "GET" || !request.url) return false;

    const pathname = new URL(request.url, `http://${host}:${port}`).pathname;
    const requestedPath = pathname === "/" ? "index.html" : pathname.slice(1);
    const filePath = path.resolve(outputDirectory, requestedPath);
    if (!filePath.startsWith(`${outputDirectory}${path.sep}`) || !fs.existsSync(filePath)) {
        return false;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = applicationTypes[extension] ?? imageTypeForPath(filePath);
    if (!contentType) return false;

    response.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
    });
    fs.createReadStream(filePath).pipe(response);
    return true;
}

function serveLocalImage(request: http.IncomingMessage, response: http.ServerResponse): boolean {
    if (request.method !== "GET" || !request.url) return false;
    const pathname = new URL(request.url, `http://${host}:${port}`).pathname;
    const relativePath = pathname.replace(/^\/+/, "");
    const contentType = imageTypeForPath(relativePath);
    if (!contentType) return false;

    const projectRoot = process.cwd();
    const filePath = path.resolve(projectRoot, relativePath);
    if (!filePath.startsWith(`${projectRoot}${path.sep}`) || !fs.existsSync(filePath)) return false;

    response.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(response);
    return true;
}

function saveChanges(updates: EditorUpdates): { arts: number; layout: number } {
    const arts = updates.arts ?? {};
    const layoutUpdate = updates.layout;
    if (layoutUpdate) validateLayoutUpdate(layoutUpdate);

    for (const [id, art] of Object.entries(arts)) {
        if (!labelById.has(id)) throw new Error(`Unknown label ID: ${id}`);
        if (!isArtUpdate(art)) throw new Error(`Invalid artwork values for ${id}`);
        const label = labelById.get(id)!;
        const candidates = label.art.options ?? [];
        if (art.asset !== label.art.asset && !candidates.includes(art.asset)) {
            throw new Error(`Artwork is not a configured option for ${id}`);
        }
    }

    for (const [id, art] of Object.entries(arts)) {
        const label = labelById.get(id)!;
        label.art.asset = art.asset;
        label.art.crop = {
            ...label.art.crop,
            focus: { x: art.crop.focus.x, y: art.crop.focus.y },
            scale: art.crop.scale,
        };
    }

    if (Object.keys(arts).length > 0) {
        const source = fs.readFileSync(labelsPath, "utf8");
        const lineEnding = source.includes("\r\n") ? "\r\n" : "\n";
        fs.writeFileSync(labelsPath, formatLabels(labels, lineEnding), "utf8");
    }

    if (layoutUpdate) {
        if (layoutUpdate.artTreatment) layout.artTreatment = layoutUpdate.artTreatment;
        if (layoutUpdate.identityBandHeightInches !== undefined) {
            layout.identityBand.heightInches = layoutUpdate.identityBandHeightInches;
        }
        if (layoutUpdate.metadataBandHeightInches !== undefined) {
            layout.metadataBand.heightInches = layoutUpdate.metadataBandHeightInches;
        }
        if (layoutUpdate.typography) layout.typography = layoutUpdate.typography;
        if (layoutUpdate.logoPalette) layout.logoPalette = layoutUpdate.logoPalette;
        if (layoutUpdate.logoOutline) layout.logoOutline = layoutUpdate.logoOutline;
        const layoutSource = fs.readFileSync(layoutPath, "utf8");
        const layoutLineEnding = layoutSource.includes("\r\n") ? "\r\n" : "\n";
        fs.writeFileSync(
            layoutPath,
            `${JSON.stringify(layout, null, 4)}${layoutLineEnding}`,
            "utf8",
        );
    }

    return {
        arts: Object.keys(arts).length,
        layout: layoutUpdate ? Object.keys(layoutUpdate).length : 0,
    };
}

const server = http.createServer((request, response) => {
    if (request.method === "GET" && request.url === "/api/config") {
        sendJson(
            response,
            200,
            buildEditorConfig(
                layout,
                categories,
                labels,
                preparedLogos,
                asset => `/art/${encodeURIComponent(asset)}`,
            ),
        );
        return;
    }

    if (serveArtwork(request, response)
        || serveApplicationFile(request, response)
        || serveLocalImage(request, response)) return;

    if (request.method !== "PUT" || request.url !== "/api/edits") {
        sendJson(response, 404, { error: "Not found." });
        return;
    }

    let body = "";
    request.setEncoding("utf8");
    request.on("data", chunk => {
        body += chunk;
        if (body.length > maxRequestBytes) request.destroy();
    });
    request.on("end", () => {
        try {
            const payload = JSON.parse(body) as EditorUpdates;
            if (payload.arts !== undefined
                && (typeof payload.arts !== "object" || Array.isArray(payload.arts))) {
                throw new Error("Expected artwork changes to be an object.");
            }
            if (payload.layout !== undefined
                && (typeof payload.layout !== "object" || Array.isArray(payload.layout))) {
                throw new Error("Expected layout changes to be an object.");
            }
            if (payload.arts === undefined && payload.layout === undefined) {
                throw new Error("Expected at least one editor change.");
            }
            sendJson(response, 200, { saved: saveChanges(payload) });
        } catch (error) {
            sendJson(response, 400, { error: error instanceof Error ? error.message : "Invalid request." });
        }
    });
});

async function start(): Promise<void> {
    await preloadRemoteImages();
    server.listen(port, host, () => {
        console.log(chalk.green.bold(`Crop editor available at http://${host}:${port}`));
    });
}

void start().catch(error => {
    console.error(chalk.red(error));
    process.exitCode = 1;
});
