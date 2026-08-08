import assert from "node:assert/strict";
import test from "node:test";
import { validateCatalog } from "./catalog-validation";
import { validateLabelConfigSplit } from "./label-config";
import {
    categories,
    editorialLabels,
    labelArt,
    labels,
    layout,
} from "./config";

test("the checked-in V2 configuration satisfies its cross-file contract", () => {
    assert.deepEqual(validateLabelConfigSplit(editorialLabels, labelArt), []);
    assert.deepEqual(validateCatalog(layout, categories, labels), []);
});

test("label art must match the editorial catalog exactly", () => {
    const draftArt = structuredClone(labelArt);
    delete draftArt[editorialLabels[0].id];
    draftArt["unknown-label"] = structuredClone(labelArt[editorialLabels[0].id]);
    assert.deepEqual(validateLabelConfigSplit(editorialLabels, draftArt), [
        `${editorialLabels[0].id}: missing artwork configuration.`,
        "unknown-label: artwork configuration has no matching label.",
    ]);
});

test("catalog validation rejects duplicate artwork candidates", () => {
    const draft = structuredClone(labels);
    draft[0].art.options = [draft[0].art.asset, draft[0].art.asset];
    assert.match(
        validateCatalog(layout, categories, draft).join("\n"),
        new RegExp(`${draft[0].id}: artwork options contain duplicates`),
    );
});

test("catalog validation rejects a metadata band below the physical label", () => {
    const draft = structuredClone(layout);
    draft.metadataBand.heightInches = 1.51;
    assert.match(
        validateCatalog(draft, categories, labels).join("\n"),
        /Metadata band cannot exceed the 1\.5 inch height available/,
    );
});
