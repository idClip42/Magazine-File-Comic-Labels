import assert from "node:assert/strict";
import test from "node:test";
import { categories, labels, layout } from "./config";
import { validateCatalog } from "./catalog-validation";

test("the checked-in V2 configuration satisfies its cross-file contract", () => {
    assert.deepEqual(validateCatalog(layout, categories, labels), []);
});

test("catalog validation rejects duplicate artwork candidates", () => {
    const draft = structuredClone(labels);
    draft[0].art.options = [draft[0].art.asset, draft[0].art.asset];
    assert.match(
        validateCatalog(layout, categories, draft).join("\n"),
        new RegExp(`${draft[0].id}: artwork options contain duplicates`),
    );
});
