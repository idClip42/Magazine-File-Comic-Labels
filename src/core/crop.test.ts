import assert from "node:assert/strict";
import test from "node:test";
import { clamp, roundCropValue } from "./crop";

test("crop helpers clamp and round persisted values predictably", () => {
    assert.equal(clamp(-1, 0, 1), 0);
    assert.equal(clamp(2, 0, 1), 1);
    assert.equal(roundCropValue(0.123456, 4), 0.1235);
});
