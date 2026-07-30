import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { layout } from "../core/config";
import { outputDirectory } from "./artwork-cache";
import { applicationTypeForPath, imageTypeForPath } from "./mime";

/** Serves the compiled Vue application and its Vite-generated assets. */
export function serveApplicationFile(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    origin: string,
): boolean {
    if (request.method !== "GET" || !request.url) return false;
    const pathname = new URL(request.url, origin).pathname;
    const requestedPath = pathname === "/" ? "index.html" : pathname.slice(1);
    const filePath = path.resolve(outputDirectory, requestedPath);
    if (!filePath.startsWith(`${outputDirectory}${path.sep}`) || !fs.existsSync(filePath)) return false;

    const contentType = applicationTypeForPath(filePath);
    if (!contentType) return false;
    response.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store" });
    fs.createReadStream(filePath).pipe(response);
    return true;
}

export function serveLocalImage(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    origin: string,
): boolean {
    if (request.method !== "GET" || !request.url) return false;
    const pathname = new URL(request.url, origin).pathname;
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
