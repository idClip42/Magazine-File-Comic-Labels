import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { countStatuses, writeResearchJson } from "./inventory";
import { canonicalMarvelIssuePage, marvelEntryKey } from "./marvel";

test("research helpers prefer a configured target identity", () => {
    assert.equal(marvelEntryKey({ labelId: "ff-001", issue: 1 }), "ff-001#1");
    assert.equal(
        marvelEntryKey({ labelId: "ff-001", runId: "ff-2018", issue: 1 }),
        "ff-2018#1",
    );
    assert.equal(
        marvelEntryKey({
            targetId: "run/ff-2018#1",
            labelId: "ff-001",
            issue: 1,
        }),
        "run/ff-2018#1",
    );
    assert.deepEqual(
        countStatuses([
            { status: "found" },
            { status: "found" },
            { status: "pending" },
        ]),
        {
            found: 2,
            pending: 1,
        },
    );
});

test("Marvel issue-page URLs are normalized without query strings", () => {
    assert.equal(
        canonicalMarvelIssuePage(
            "https://www.marvel.com/comics/issue/12345/example?view=full#cover",
        ),
        "https://www.marvel.com/comics/issue/12345/example",
    );
    assert.equal(
        canonicalMarvelIssuePage("https://example.com/comics/issue/12345"),
        undefined,
    );
});

test("research inventories use four-space JSON indentation", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "comic-labels-"));
    const filePath = path.join(directory, "inventory.json");
    try {
        writeResearchJson(filePath, { entries: [{ status: "found" }] });
        assert.equal(
            fs.readFileSync(filePath, "utf8"),
            '{\n    "entries": [\n        {\n            "status": "found"\n        }\n    ]\n}\n',
        );
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});
