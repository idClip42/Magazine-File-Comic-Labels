import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";

type HttpResult = {
    body: Buffer;
    headers: http.IncomingHttpHeaders;
    status: number;
};

function request(
    port: number,
    requestPath: string,
    method = "GET",
    body?: unknown,
): Promise<HttpResult> {
    const payload = body === undefined ? undefined : JSON.stringify(body);
    return new Promise((resolve, reject) => {
        const request = http.request(
            {
                host: "127.0.0.1",
                port,
                path: requestPath,
                method,
                headers: payload
                    ? {
                          "Content-Type": "application/json",
                          "Content-Length": Buffer.byteLength(payload),
                      }
                    : undefined,
            },
            response => {
                const chunks: Buffer[] = [];
                response.on("data", chunk => chunks.push(Buffer.from(chunk)));
                response.on("end", () =>
                    resolve({
                        body: Buffer.concat(chunks),
                        headers: response.headers,
                        status: response.statusCode ?? 0,
                    }),
                );
            },
        );
        request.on("error", reject);
        if (payload) request.write(payload);
        request.end();
    });
}

async function availablePort(): Promise<number> {
    const server = http.createServer();
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const { port } = address;
    server.close();
    await once(server, "close");
    return port;
}

async function closeServer(server: http.Server): Promise<void> {
    server.close();
    await once(server, "close");
}

async function stopEditor(editor: ChildProcess | undefined): Promise<void> {
    if (!editor || editor.exitCode !== null) return;
    editor.kill();
    await once(editor, "exit");
}

async function waitForEditor(port: number, editor: ChildProcess): Promise<void> {
    let latestError = "";
    for (let attempt = 0; attempt < 100; attempt += 1) {
        if (editor.exitCode !== null)
            throw new Error(`Editor stopped early: ${latestError}`);
        try {
            const response = await request(port, "/api/config");
            if (response.status === 200) return;
            latestError = `HTTP ${response.status}`;
        } catch (error) {
            latestError = error instanceof Error ? error.message : String(error);
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    throw new Error(`Editor did not start: ${latestError}`);
}

function startEditor(root: string, port: number): ChildProcess {
    return spawn(
        process.execPath,
        [path.join(process.cwd(), "dist", "src", "editor-server", "index.js")],
        {
            cwd: root,
            env: { ...process.env, CROP_EDITOR_PORT: String(port) },
            stdio: "ignore",
        },
    );
}

test(
    "a manually added cover persists, redirects before restart, then preloads",
    { timeout: 30_000 },
    async t => {
        const sourceRoot = process.cwd();
        const fixtureRoot = fs.mkdtempSync(
            path.join(os.tmpdir(), "comic-label-editor-test-"),
        );
        const imageBody = Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLq7wAAAABJRU5ErkJggg==",
            "base64",
        );
        const imageServer = http.createServer((_request, response) => {
            response.writeHead(200, { "Content-Type": "image/png" });
            response.end(imageBody);
        });
        let editor: ChildProcess | undefined;

        t.after(async () => {
            await stopEditor(editor);
            await closeServer(imageServer);
            fs.rmSync(fixtureRoot, { recursive: true, force: true });
        });

        imageServer.listen(0, "127.0.0.1");
        await once(imageServer, "listening");
        const imageAddress = imageServer.address();
        assert.ok(imageAddress && typeof imageAddress !== "string");
        const coverUrl = `http://127.0.0.1:${imageAddress.port}/cover.png`;

        const layout = JSON.parse(
            fs.readFileSync(path.join(sourceRoot, "config", "layout.json"), "utf8"),
        );
        const originalAsset = "logos/ff-logo-1960s.svg";
        fs.mkdirSync(path.join(fixtureRoot, "config"), { recursive: true });
        fs.mkdirSync(path.join(fixtureRoot, "logos"), { recursive: true });
        fs.copyFileSync(
            path.join(sourceRoot, originalAsset),
            path.join(fixtureRoot, originalAsset),
        );
        fs.writeFileSync(
            path.join(fixtureRoot, "config", "layout.json"),
            `${JSON.stringify(layout, null, 4)}\n`,
        );
        fs.writeFileSync(
            path.join(fixtureRoot, "config", "categories.json"),
            `${JSON.stringify(
                {
                    test: {
                        name: "Test",
                        color: "#000000",
                        logos: { test: { asset: originalAsset } },
                    },
                },
                null,
                4,
            )}\n`,
        );
        fs.writeFileSync(
            path.join(fixtureRoot, "config", "labels.json"),
            `${JSON.stringify(
                [
                    {
                        id: "test-label",
                        category: "test",
                        logo: "test",
                        art: {
                            asset: originalAsset,
                            crop: { focus: { x: 0.5, y: 0.5 }, scale: 1 },
                        },
                        contents: [
                            {
                                name: "Test",
                                issues: [1, 1],
                                years: [2026, 2026],
                            },
                        ],
                    },
                ],
                null,
                4,
            )}\n`,
        );

        let editorPort = await availablePort();
        editor = startEditor(fixtureRoot, editorPort);
        await waitForEditor(editorPort, editor);

        const designSaved = await request(editorPort, "/api/edits", "PUT", {
            layout: {
                variant: "B",
                changes: {
                    artTreatment: {
                        ...layout.designVariants.B.artTreatment,
                        contrast: 1.11,
                    },
                },
            },
        });
        assert.equal(designSaved.status, 200);
        const persistedLayout = JSON.parse(
            fs.readFileSync(
                path.join(fixtureRoot, "config", "layout.json"),
                "utf8",
            ),
        );
        assert.equal(persistedLayout.designVariants.A.artTreatment.contrast, 1.06);
        assert.equal(persistedLayout.designVariants.B.artTreatment.contrast, 1.11);

        const crop = { focus: { x: 0.25, y: 0.75 }, scale: 1.5 };
        const saved = await request(editorPort, "/api/edits", "PUT", {
            arts: {
                "test-label": {
                    asset: coverUrl,
                    crop,
                    options: [originalAsset, coverUrl],
                },
            },
        });
        assert.equal(saved.status, 200);

        const persisted = JSON.parse(
            fs.readFileSync(
                path.join(fixtureRoot, "config", "labels.json"),
                "utf8",
            ),
        )[0];
        assert.equal(persisted.art.asset, coverUrl);
        assert.deepEqual(persisted.art.crop, crop);
        assert.deepEqual(persisted.art.options, [originalAsset, coverUrl]);

        const refreshedConfig = JSON.parse(
            (await request(editorPort, "/api/config")).body.toString("utf8"),
        );
        const redirectBeforeRestart = await request(
            editorPort,
            refreshedConfig.artworkUrls[coverUrl],
        );
        assert.equal(redirectBeforeRestart.status, 302);
        assert.equal(redirectBeforeRestart.headers.location, coverUrl);

        await stopEditor(editor);
        editor = undefined;

        editorPort = await availablePort();
        editor = startEditor(fixtureRoot, editorPort);
        await waitForEditor(editorPort, editor);
        const restartedConfig = JSON.parse(
            (await request(editorPort, "/api/config")).body.toString("utf8"),
        );
        const servedAfterRestart = await request(
            editorPort,
            restartedConfig.artworkUrls[coverUrl],
        );
        assert.equal(servedAfterRestart.status, 200);
        assert.equal(servedAfterRestart.headers["content-type"], "image/png");
        assert.deepEqual(servedAfterRestart.body, imageBody);
    },
);
