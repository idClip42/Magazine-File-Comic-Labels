import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { ArtCrop, LabelConfig } from "./types";

const host = "127.0.0.1";
const port = 4173;
const outputPath = path.join(process.cwd(), "dist", "v2", "index.html");
const labelsPath = path.join(process.cwd(), "config", "labels.json");
const maxRequestBytes = 1024 * 1024;
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

function sendJson(response: http.ServerResponse, status: number, body: object): void {
    response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(body));
}

function serveImage(request: http.IncomingMessage, response: http.ServerResponse): boolean {
    if (request.method !== "GET" || !request.url) return false;
    const pathname = new URL(request.url, `http://${host}:${port}`).pathname;
    const relativePath = pathname.replace(/^\/+/, "");
    const extension = path.extname(relativePath).toLowerCase();
    if (!imageTypes[extension]) return false;

    const projectRoot = process.cwd();
    const filePath = path.resolve(projectRoot, relativePath);
    if (!filePath.startsWith(`${projectRoot}${path.sep}`) || !fs.existsSync(filePath)) return false;

    response.writeHead(200, { "Content-Type": imageTypes[extension] });
    fs.createReadStream(filePath).pipe(response);
    return true;
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

function formatLabels(labels: LabelConfig[], lineEnding: string): string {
    const expanded = JSON.stringify(labels, null, 4);
    const compactRanges = expanded.replace(
        /\[\n\s+(-?\d+(?:\.\d+)?),\n\s+(-?\d+(?:\.\d+)?)\n\s+\]/g,
        "[$1, $2]",
    );
    return `${compactRanges}${lineEnding}`;
}

function saveCrops(crops: Record<string, CropUpdate>): number {
    const source = fs.readFileSync(labelsPath, "utf8");
    const labels = JSON.parse(source) as LabelConfig[];
    const labelById = new Map(labels.map(label => [label.id, label]));

    for (const [id, crop] of Object.entries(crops)) {
        if (!labelById.has(id)) throw new Error(`Unknown label ID: ${id}`);
        if (!isCropUpdate(crop)) throw new Error(`Invalid crop values for ${id}`);
    }

    for (const [id, crop] of Object.entries(crops)) {
        const label = labelById.get(id)!;
        label.art.crop = { ...label.art.crop, focus: crop.focus, scale: crop.scale };
    }

    const lineEnding = source.includes("\r\n") ? "\r\n" : "\n";
    fs.writeFileSync(labelsPath, formatLabels(labels, lineEnding), "utf8");
    return Object.keys(crops).length;
}

const server = http.createServer((request, response) => {
    if (request.method === "GET" && (request.url === "/" || request.url === "/index.html")) {
        if (!fs.existsSync(outputPath)) {
            sendJson(response, 404, { error: "Build the editor first with npm run build." });
            return;
        }
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        fs.createReadStream(outputPath).pipe(response);
        return;
    }

    if (serveImage(request, response)) return;

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

server.listen(port, host, () => {
    console.log(`Crop editor available at http://${host}:${port}`);
});
