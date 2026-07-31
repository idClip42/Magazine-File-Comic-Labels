import assert from "node:assert/strict";
import type http from "node:http";
import test from "node:test";
import {
    registerArtworkAssets,
    serveArtwork,
} from "./artwork";
import { imageCache } from "./artwork-cache";

type ResponseCapture = {
    status?: number;
    headers?: Record<string, string>;
    body?: Buffer;
};

function serve(asset: string): ResponseCapture {
    const captured: ResponseCapture = {};
    const response = {
        writeHead(status: number, headers: Record<string, string>) {
            captured.status = status;
            captured.headers = headers;
        },
        end(body?: Buffer) {
            captured.body = body;
        },
    } as unknown as http.ServerResponse;
    const request = {
        method: "GET",
        url: `/art/${encodeURIComponent(asset)}`,
    } as http.IncomingMessage;
    assert.equal(serveArtwork(request, response), true);
    return captured;
}

test("newly registered uncached remote artwork redirects to its source", () => {
    const asset = "https://example.test/new-cover.jpg";
    imageCache.delete(asset);
    registerArtworkAssets([asset]);
    const result = serve(asset);
    assert.equal(result.status, 302);
    assert.equal(result.headers?.Location, asset);
});

test("cached remote artwork is served through the local editor", () => {
    const asset = "https://example.test/cached-cover.jpg";
    const body = Buffer.from("cover");
    registerArtworkAssets([asset]);
    imageCache.set(asset, { body, contentType: "image/jpeg" });
    const result = serve(asset);
    assert.equal(result.status, 200);
    assert.equal(result.headers?.["Content-Type"], "image/jpeg");
    assert.deepEqual(result.body, body);
    imageCache.delete(asset);
});
