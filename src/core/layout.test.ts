import assert from "node:assert/strict";
import test from "node:test";
import { layout } from "./config";
import { maximumMetadataBandHeight } from "./layout";
import { layoutForVariant } from "./types";

test("metadata-band height ends at the physical bottom edge", () => {
    assert.equal(
        maximumMetadataBandHeight({
            face: { widthInches: 3.875, heightInches: 11.75 },
            metadataBand: { topInches: 10.25, heightInches: 1.15 },
        }),
        1.5,
    );
});

test("a reactive design variant resolves without cloning the proxy", () => {
    const config = structuredClone(layout);
    config.designVariants.A = new Proxy(config.designVariants.A, {});

    const resolved = layoutForVariant(config, "A");
    assert.equal(resolved.face.widthInches, 3.875);
    assert.equal(resolved.artTreatment, config.designVariants.A.artTreatment);
});
