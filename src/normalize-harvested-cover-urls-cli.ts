import fs from "node:fs";
import path from "node:path";

const coversPath = path.join(process.cwd(), "docs", "MARVEL-COVER-URLS.json");

type CoverEntry = { cleanImageUrl?: string; sourceImageUrl?: string; status: string };
type CoverInventory = { entries?: CoverEntry[] };

const inventory = JSON.parse(fs.readFileSync(coversPath, "utf8")) as CoverInventory;
if (!Array.isArray(inventory.entries)) throw new Error(`${coversPath} does not contain an entries array.`);

function normalizeMarvelJpegUrl(value: string): string {
    const url = new URL(value);
    if (url.hostname === "cdn.marvel.com") {
        url.pathname = url.pathname.replace(/\.(?:webp|png|jpe?g)$/i, ".jpg");
    }
    return url.toString();
}

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
fs.writeFileSync(coversPath, `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
console.log(`Normalized ${updated} harvested Marvel CDN URL(s) to .jpg.`);
