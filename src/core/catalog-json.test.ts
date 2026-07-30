import assert from "node:assert/strict";
import test from "node:test";
import { formatCatalogJson } from "./catalog-json";

test("formatCatalogJson keeps numeric ranges compact", () => {
    const formatted = formatCatalogJson({ issues: [1, 25], name: "Fantastic Four" });
    assert.match(formatted, /"issues": \[1, 25\]/);
    assert.match(formatted, /"name": "Fantastic Four"/);
    assert.ok(formatted.endsWith("\n"));
});
