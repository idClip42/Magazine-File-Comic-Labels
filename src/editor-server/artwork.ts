import chalk from "chalk";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { isMarvelCdnImage, isRemoteAsset } from "../core/assets";
import { labels, layout } from "../core/config";
import {
    imageCache,
    loadArtworkFromDiskCache,
    saveArtworkToDiskCache,
} from "./artwork-cache";
import { sendJson } from "./http";
import { imageTypeForPath } from "./mime";

const preloadConcurrency = 12;
const preloadProgressInterval = 10;
const slowPreloadThresholdMilliseconds = 2_000;
const marvelPreloadDelayMilliseconds = 500;
const marvelBlockThreshold = 3;

export const configuredArtworkAssets = new Set(
    labels.flatMap(label => [label.art.asset, ...(label.art.options ?? [])]),
);

function wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function downloadRemoteImage(asset: string): Promise<void> {
    const response = await fetch(asset, {
        headers: isMarvelCdnImage(asset)
            ? {
                  Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                  "Accept-Language": "en-US,en;q=0.8",
                  "User-Agent":
                      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
              }
            : {
                  Accept: "image/jpeg,image/png,image/gif,image/svg+xml,*/*;q=0.8",
              },
        signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok)
        throw new Error(`${response.status} ${response.statusText}`);

    const contentType =
        response.headers.get("content-type")?.split(";", 1)[0] ??
        imageTypeForPath(asset) ??
        "application/octet-stream";
    const image = {
        body: Buffer.from(await response.arrayBuffer()),
        contentType,
    };
    imageCache.set(asset, image);
    saveArtworkToDiskCache(asset, image);
}

/** Retains the deliberate eager preload, including the conservative Marvel cadence. */
export async function preloadRemoteImages(): Promise<void> {
    const preloadStartedAt = performance.now();
    const assets = [...configuredArtworkAssets].filter(isRemoteAsset);
    const failures: string[] = [];
    let downloads = 0;
    let nextIndex = 0;
    let completed = 0;

    const diskLoadResults = await Promise.all(
        assets.map(async asset => ({
            asset,
            loaded: await loadArtworkFromDiskCache(asset),
        })),
    );
    const assetsToDownload = diskLoadResults
        .filter(result => !result.loaded)
        .map(result => result.asset);
    const marvelAssets = assetsToDownload.filter(isMarvelCdnImage);
    const otherAssets = assetsToDownload.filter(
        asset => !isMarvelCdnImage(asset),
    );
    const diskCacheHits = assets.length - assetsToDownload.length;

    if (diskCacheHits > 0) {
        console.log(
            chalk.blue(
                `Art disk cache: ${diskCacheHits}/${assets.length} loaded concurrently.`,
            ),
        );
    }
    console.log(chalk.cyan(`Preloading ${assets.length} remote art image(s)…`));

    const downloadAsset = async (
        asset: string,
    ): Promise<string | undefined> => {
        const startedAt = performance.now();
        try {
            await downloadRemoteImage(asset);
            downloads += 1;
            return undefined;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unknown error";
            failures.push(`${asset} (${message})`);
            return message;
        } finally {
            const elapsedMilliseconds = performance.now() - startedAt;
            if (elapsedMilliseconds >= slowPreloadThresholdMilliseconds) {
                const outcome = imageCache.has(asset) ? "cached" : "failed";
                console.log(
                    chalk.yellow(
                        `Slow art download (${outcome}, ${(elapsedMilliseconds / 1000).toFixed(1)}s): ${asset}`,
                    ),
                );
            }
            completed += 1;
            if (
                completed % preloadProgressInterval === 0 ||
                completed === assetsToDownload.length
            ) {
                console.log(
                    chalk.blue(
                        `Art download: ${completed}/${assetsToDownload.length} complete (${downloads} cached, ${failures.length} failed).`,
                    ),
                );
            }
        }
    };

    const worker = async () => {
        while (nextIndex < otherAssets.length)
            await downloadAsset(otherAssets[nextIndex++]);
    };
    const nonMarvelPreload = Promise.all(
        Array.from(
            { length: Math.min(preloadConcurrency, otherAssets.length) },
            worker,
        ),
    );
    let consecutiveMarvelBlocks = 0;
    for (let index = 0; index < marvelAssets.length; index += 1) {
        if (index > 0) await wait(marvelPreloadDelayMilliseconds);
        const failure = await downloadAsset(marvelAssets[index]);
        consecutiveMarvelBlocks =
            failure?.startsWith("403 ") || failure?.startsWith("429 ")
                ? consecutiveMarvelBlocks + 1
                : 0;
        if (consecutiveMarvelBlocks >= marvelBlockThreshold) {
            const remaining = marvelAssets.length - index - 1;
            console.warn(
                chalk.yellow(
                    `Stopping Marvel CDN preload after ${marvelBlockThreshold} consecutive blocks; ${remaining} uncached Marvel image(s) will retry on the next start.`,
                ),
            );
            break;
        }
    }
    await nonMarvelPreload;
    const megabytes =
        [...imageCache.values()].reduce(
            (total, image) => total + image.body.length,
            0,
        ) /
        1024 /
        1024;
    const elapsedSeconds = (performance.now() - preloadStartedAt) / 1000;
    const summary = `Preloaded ${imageCache.size}/${assets.length} remote art image(s) (${diskCacheHits} from disk, ${downloads} downloaded; ${megabytes.toFixed(1)} MB in memory) in ${elapsedSeconds.toFixed(1)}s.`;
    console.log(
        failures.length > 0 ? chalk.yellow(summary) : chalk.green(summary),
    );
    if (failures.length > 0) {
        const examples = failures.slice(0, 3).join("; ");
        const remainder =
            failures.length > 3 ? ` (${failures.length - 3} more)` : "";
        console.warn(
            chalk.red(
                `Could not preload ${failures.length} art image(s): ${examples}${remainder}`,
            ),
        );
    }
}

export function serveArtwork(
    request: http.IncomingMessage,
    response: http.ServerResponse,
): boolean {
    if (request.method !== "GET" || !request.url?.startsWith("/art/"))
        return false;
    const asset = decodeURIComponent(
        request.url.slice("/art/".length).split("?", 1)[0],
    );
    if (!configuredArtworkAssets.has(asset)) {
        sendJson(response, 404, { error: "Unknown artwork." });
        return true;
    }

    if (isRemoteAsset(asset)) {
        const image = imageCache.get(asset);
        if (!image) {
            sendJson(response, 503, {
                error: "Artwork was not available when the editor started.",
            });
            return true;
        }
        response.writeHead(200, {
            "Content-Type": image.contentType,
            "Cache-Control": "no-store",
        });
        response.end(image.body);
        return true;
    }

    const projectRoot = process.cwd();
    const filePath = path.resolve(projectRoot, layout.localAssetRoot, asset);
    const contentType = imageTypeForPath(filePath);
    if (
        !contentType ||
        !filePath.startsWith(`${projectRoot}${path.sep}`) ||
        !fs.existsSync(filePath)
    ) {
        sendJson(response, 404, { error: "Local artwork is unavailable." });
        return true;
    }
    response.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
    });
    fs.createReadStream(filePath).pipe(response);
    return true;
}
