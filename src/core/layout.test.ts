import assert from "node:assert/strict";
import test from "node:test";
import { maximumMetadataBandHeight } from "./layout";

test("metadata-band height ends at the physical bottom edge", () => {
    assert.equal(
        maximumMetadataBandHeight({
            face: { widthInches: 3.875, heightInches: 11.75 },
            metadataBand: { topInches: 10.25, heightInches: 1.15 },
        }),
        1.5,
    );
});
