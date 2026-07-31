import assert from "node:assert/strict";
import test from "node:test";
import { normalizeManualArtworkUrl } from "./assets";

test("manual Marvel cover URLs become clean JPEG URLs", () => {
    assert.equal(
        normalizeManualArtworkUrl(
            "https://cdn.marvel.com/u/prod/marvel/i/mg/a/b0/example/portrait_uncanny.webp?width=500",
        ),
        "https://cdn.marvel.com/u/prod/marvel/i/mg/a/b0/example/clean.jpg",
    );
});

test("manual artwork URLs must use HTTP(S)", () => {
    assert.throws(
        () => normalizeManualArtworkUrl("file:///C:/cover.jpg"),
        /HTTP or HTTPS/,
    );
});
