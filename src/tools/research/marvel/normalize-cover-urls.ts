import fs from "node:fs";
import { normalizeMarvelJpegUrl } from "../../../core/assets";
import { writeResearchJson } from "../shared/inventory";
import { marvelHarvestPaths } from "./plan";

const coversPath = marvelHarvestPaths.covers;

type CoverEntry = { cleanImageUrl?: string; sourceImageUrl?: string; status: string };
type CoverInventory = { entries?: CoverEntry[] };

const inventory = JSON.parse(fs.readFileSync(coversPath, "utf8")) as CoverInventory;
if (!Array.isArray(inventory.entries)) throw new Error(`${coversPath} does not contain an entries array.`);

let updated = 0;
for (const entry of inventory.entries) {
    if (entry.status !== "found") continue;
    for (const key of ["sourceImageUrl", "cleanImageUrl"] as const) {
        if (!entry[key]) continue;
        const jpegUrl = normalizeMarvelJpegUrl(entry[key]);
        if (jpegUrl === entry[key]) continue;
        entry[key] = jpegUrl;
        updated += 1;
    }
}
writeResearchJson(coversPath, inventory);
console.log(`Normalized ${updated} harvested Marvel CDN URL(s) to .jpg.`);
