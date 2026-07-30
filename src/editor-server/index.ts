import http from "node:http";
import chalk from "chalk";
import { categories, labels, layout } from "../core/config";
import type { EditorUpdates } from "../core/editor-updates";
import { buildEditorConfig } from "../build/editor-config";
import { prepareLogos } from "../build/logo-prep";
import { migrateLegacyArtworkCache, outputDirectory } from "./artwork-cache";
import { preloadRemoteImages, serveArtwork } from "./artwork";
import { saveChanges } from "./edits";
import { sendJson } from "./http";
import { serveApplicationFile, serveLocalImage } from "./static-files";

const host = "127.0.0.1";
const port = Number(process.env.CROP_EDITOR_PORT ?? 4173);
const maxRequestBytes = 1024 * 1024;
const preparedLogos = prepareLogos(layout, categories, outputDirectory);
const origin = `http://${host}:${port}`;

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
        || serveApplicationFile(request, response, origin)
        || serveLocalImage(request, response, origin)) return;

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
            const updates = JSON.parse(body) as EditorUpdates;
            sendJson(response, 200, { saved: saveChanges(updates) });
        } catch (error) {
            sendJson(response, 400, { error: error instanceof Error ? error.message : "Invalid request." });
        }
    });
});

async function start(): Promise<void> {
    const migration = migrateLegacyArtworkCache();
    if (migration === "migrated") {
        console.log(chalk.green("Moved artwork cache from dist/artwork-cache to .cache/artwork."));
    }
    await preloadRemoteImages();
    server.listen(port, host, () => {
        console.log(chalk.green.bold(`Crop editor available at ${origin}`));
    });
}

void start().catch(error => {
    console.error(chalk.red(error));
    process.exitCode = 1;
});
