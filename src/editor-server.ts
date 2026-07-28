import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { categories, labels, layout } from "./config";
import { prepareLogos } from "./logo-prep";
import { renderDocument } from "./render";
import { ArtCrop, LabelConfig } from "./types";

const host = "127.0.0.1";
const port = Number(process.env.CROP_EDITOR_PORT ?? 4173);
const labelsPath = path.join(process.cwd(), "config", "labels.json");
const outputDirectory = path.join(process.cwd(), "dist", "v2");
const maxRequestBytes = 1024 * 1024;
const preloadConcurrency = 6;
const imageTypes: Record<string, string> = {
    ".avif": "image/avif",
    ".gif": "image/gif",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
};

type CropUpdate = Pick<ArtCrop, "focus" | "scale">;
type CachedImage = { body: Buffer; contentType: string };

const labelById = new Map(labels.map(label => [label.id, label]));
const imageCache = new Map<string, CachedImage>();
const preparedLogos = prepareLogos(layout, categories, outputDirectory);

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

function isCropUpdate(value: unknown): value is CropUpdate {
    if (!value || typeof value !== "object") return false;
    const crop = value as CropUpdate;
    return Number.isFinite(crop.focus?.x) && Number.isFinite(crop.focus?.y)
        && Number.isFinite(crop.scale)
        && crop.focus.x >= 0 && crop.focus.x <= 1
        && crop.focus.y >= 0 && crop.focus.y <= 1
        && crop.scale >= 0.5 && crop.scale <= 5;
}

function formatLabels(configuredLabels: LabelConfig[], lineEnding: string): string {
    const expanded = JSON.stringify(configuredLabels, null, 4);
    const compactRanges = expanded.replace(
        /\[\n\s+(-?\d+(?:\.\d+)?),\n\s+(-?\d+(?:\.\d+)?)\n\s+\]/g,
        "[$1, $2]",
    );
    return `${compactRanges}${lineEnding}`;
}

async function cacheRemoteImage(asset: string): Promise<void> {
    const response = await fetch(asset, {
        headers: { Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8" },
        signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

    const contentType = response.headers.get("content-type")?.split(";", 1)[0]
        ?? imageTypeForPath(asset)
        ?? "application/octet-stream";
    imageCache.set(asset, {
        body: Buffer.from(await response.arrayBuffer()),
        contentType,
    });
}

async function preloadRemoteImages(): Promise<void> {
    const assets = [...new Set(labels.map(label => label.art.asset).filter(isRemoteImage))];
    const failures: string[] = [];
    let nextIndex = 0;

    console.log(`Preloading ${assets.length} remote art image(s)…`);

    const worker = async () => {
        while (nextIndex < assets.length) {
            const asset = assets[nextIndex++];
            try {
                await cacheRemoteImage(asset);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                failures.push(`${asset} (${message})`);
            }
        }
    };

    await Promise.all(Array.from({ length: Math.min(preloadConcurrency, assets.length) }, worker));
    const megabytes = [...imageCache.values()].reduce((total, image) => total + image.body.length, 0) / 1024 / 1024;
    console.log(`Preloaded ${imageCache.size}/${assets.length} remote art image(s) (${megabytes.toFixed(1)} MB in memory).`);
    for (const failure of failures) console.warn(`Could not preload art: ${failure}`);
}

function serveArtwork(request: http.IncomingMessage, response: http.ServerResponse): boolean {
    if (request.method !== "GET" || !request.url?.startsWith("/art/")) return false;
    const id = decodeURIComponent(request.url.slice("/art/".length).split("?", 1)[0]);
    const label = labelById.get(id);
    if (!label) {
        sendJson(response, 404, { error: "Unknown label." });
        return true;
    }

    if (isRemoteImage(label.art.asset)) {
        const image = imageCache.get(label.art.asset);
        if (!image) {
            sendJson(response, 503, { error: "Artwork was not available when the editor started." });
            return true;
        }
        response.writeHead(200, { "Content-Type": image.contentType, "Cache-Control": "no-store" });
        response.end(image.body);
        return true;
    }

    const projectRoot = process.cwd();
    const filePath = path.resolve(projectRoot, layout.localAssetRoot, label.art.asset);
    const contentType = imageTypeForPath(filePath);
    if (!contentType || !filePath.startsWith(`${projectRoot}${path.sep}`) || !fs.existsSync(filePath)) {
        sendJson(response, 404, { error: "Local artwork is unavailable." });
        return true;
    }
    response.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store" });
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

function saveCrops(crops: Record<string, CropUpdate>): number {
    for (const [id, crop] of Object.entries(crops)) {
        if (!labelById.has(id)) throw new Error(`Unknown label ID: ${id}`);
        if (!isCropUpdate(crop)) throw new Error(`Invalid crop values for ${id}`);
    }

    for (const [id, crop] of Object.entries(crops)) {
        const label = labelById.get(id)!;
        label.art.crop = {
            ...label.art.crop,
            focus: { x: crop.focus.x, y: crop.focus.y },
            scale: crop.scale,
        };
    }

    const source = fs.readFileSync(labelsPath, "utf8");
    const lineEnding = source.includes("\r\n") ? "\r\n" : "\n";
    fs.writeFileSync(labelsPath, formatLabels(labels, lineEnding), "utf8");
    return Object.keys(crops).length;
}

const server = http.createServer((request, response) => {
    if (request.method === "GET" && (request.url === "/" || request.url === "/index.html")) {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
        response.end(renderDocument(labels, preparedLogos, label => `/art/${encodeURIComponent(label.id)}`));
        return;
    }

    if (serveArtwork(request, response) || serveLocalImage(request, response)) return;

    if (request.method !== "PUT" || request.url !== "/api/crops") {
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
            const payload = JSON.parse(body) as { crops?: unknown };
            if (!payload.crops || typeof payload.crops !== "object" || Array.isArray(payload.crops)) {
                throw new Error("Expected a crops object.");
            }
            sendJson(response, 200, { saved: saveCrops(payload.crops as Record<string, CropUpdate>) });
        } catch (error) {
            sendJson(response, 400, { error: error instanceof Error ? error.message : "Invalid request." });
        }
    });
});

async function start(): Promise<void> {
    await preloadRemoteImages();
    server.listen(port, host, () => {
        console.log(`Crop editor available at http://${host}:${port}`);
    });
}

void start().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
