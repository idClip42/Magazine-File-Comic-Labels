import fs from "node:fs";
import path from "node:path";
import { LabelConfig } from "./types";

const labelsPath = path.join(process.cwd(), "config", "labels.json");
const coversPath = path.join(process.cwd(), "docs", "MARVEL-COVER-URLS.json");

type HarvestedCover = {
    labelId: string;
    issue: string;
    status: string;
    cleanImageUrl?: string;
};

type CoverInventory = { entries?: HarvestedCover[] };

function usage(): never {
    console.error("Usage: npm run apply:harvested-covers -- --write");
    console.error("Without --write, reports the catalog changes without modifying config/labels.json.");
    process.exit(1);
}

function formatLabels(labels: LabelConfig[], lineEnding: string): string {
    const expanded = JSON.stringify(labels, null, 4);
    const compactRanges = expanded.replace(
        /\[\n\s+(-?\d+(?:\.\d+)?),\n\s+(-?\d+(?:\.\d+)?)\n\s+\]/g,
        "[$1, $2]",
    );
    return `${compactRanges}${lineEnding}`;
}

function isCleanMarvelUrl(value: string | undefined): value is string {
    if (!value) return false;
    try {
        const url = new URL(value);
        return url.hostname === "cdn.marvel.com" && /\/clean\.jpg$/i.test(url.pathname);
    } catch {
        return false;
    }
}

function normalizeMarvelJpegUrl(value: string): string {
    try {
        const url = new URL(value);
        if (url.hostname === "cdn.marvel.com") {
            url.pathname = url.pathname.replace(/\.(?:webp|png|jpe?g)$/i, ".jpg");
        }
        return url.toString();
    } catch {
        return value;
    }
}

function main(): void {
    const args = process.argv.slice(2);
    if (args.includes("--help")) usage();
    if (args.some(arg => arg !== "--write")) usage();
    const write = args.includes("--write");
    const original = fs.readFileSync(labelsPath, "utf8");
    const lineEnding = original.includes("\r\n") ? "\r\n" : "\n";
    const labels = JSON.parse(original) as LabelConfig[];
    const inventory = JSON.parse(fs.readFileSync(coversPath, "utf8")) as CoverInventory;
    if (!Array.isArray(inventory.entries)) throw new Error(`${coversPath} does not contain an entries array.`);

    const coversByLabel = new Map<string, string[]>();
    for (const cover of inventory.entries) {
        if (cover.status !== "found") continue;
        if (!isCleanMarvelUrl(cover.cleanImageUrl)) {
            throw new Error(`Invalid clean Marvel URL for ${cover.labelId} #${cover.issue}.`);
        }
        const urls = coversByLabel.get(cover.labelId) ?? [];
        urls.push(cover.cleanImageUrl);
        coversByLabel.set(cover.labelId, urls);
    }

    const labelIds = new Set(labels.map(label => label.id));
    for (const labelId of coversByLabel.keys()) {
        if (!labelIds.has(labelId)) throw new Error(`Harvested cover references missing label ${labelId}.`);
    }

    let additions = 0;
    let touchedLabels = 0;
    for (const label of labels) {
        const harvested = coversByLabel.get(label.id);
        if (!harvested) continue;
        const originalOptions = label.art.options ?? [];
        const options = [...new Set(originalOptions.map(normalizeMarvelJpegUrl))];
        const optionsChanged = options.length !== originalOptions.length
            || options.some((url, index) => url !== originalOptions[index]);
        const known = new Set(options);
        const missing = harvested.filter(url => !known.has(url));
        const replacementAsset = normalizeMarvelJpegUrl(label.art.asset);
        if (!missing.length && replacementAsset === label.art.asset && !optionsChanged) continue;
        label.art.asset = replacementAsset;
        label.art.options = [...options, ...missing];
        additions += missing.length;
        touchedLabels += 1;
    }

    console.log(`${write ? "Applying" : "Would apply"} ${additions} harvested clean cover URL(s) across ${touchedLabels} label(s).`);
    if (write) fs.writeFileSync(labelsPath, formatLabels(labels, lineEnding), "utf8");
}

main();
