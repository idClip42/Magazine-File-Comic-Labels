import fs from "node:fs";
import path from "node:path";
import { LabelConfig } from "../../core/types";
import { writeCatalogJson } from "../../core/catalog-json";
import { isCleanMarvelJpegUrl, normalizeMarvelJpegUrl } from "../../core/assets";
import { marvelHarvestPaths } from "../research/marvel/plan";

const labelsPath = path.join(process.cwd(), "config", "labels.json");
const coversPath = marvelHarvestPaths.covers;

type HarvestedCover = {
    labelId: string;
    issue: string | number;
    status: string;
    cleanImageUrl?: string;
    sourceImageUrl?: string;
};

type CoverInventory = { entries?: HarvestedCover[] };

function usage(): never {
    console.error("Usage: npm run apply:harvested-covers -- --write");
    console.error("Without --write, reports the catalog changes without modifying config/labels.json.");
    process.exit(1);
}

function issueFromLegacyAsset(asset: string, covers: HarvestedCover[]): string | undefined {
    const direct = covers.find(cover => cover.cleanImageUrl === asset || cover.sourceImageUrl === asset);
    if (direct) return String(direct.issue);
    const issue = asset.match(/vol(?:ume)?[_-]?\d+[_-](\d+)(?:[_./?]|$)/i)?.[1]
        ?? asset.match(/(?:issue|_)(\d+)(?:[_./?]|$)/i)?.[1];
    return issue && covers.some(cover => String(cover.issue) === issue) ? issue : undefined;
}

function main(): void {
    const args = process.argv.slice(2);
    if (args.includes("--help")) usage();
    if (args.some(arg => arg !== "--write")) usage();
    const write = args.includes("--write");
    const original = fs.readFileSync(labelsPath, "utf8");
    const labels = JSON.parse(original) as LabelConfig[];
    const inventory = JSON.parse(fs.readFileSync(coversPath, "utf8")) as CoverInventory;
    if (!Array.isArray(inventory.entries)) throw new Error(`${coversPath} does not contain an entries array.`);
    const coverEntries = inventory.entries;

    const coversByLabel = new Map<string, string[]>();
    for (const cover of coverEntries) {
        if (cover.status !== "found") continue;
        if (!isCleanMarvelJpegUrl(cover.cleanImageUrl)) {
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
    let directOrIssueSelections = 0;
    let fallbackSelections = 0;
    for (const label of labels) {
        const harvested = coversByLabel.get(label.id);
        if (!harvested) continue;
        const labelCovers = coverEntries.filter(entry => entry.labelId === label.id && entry.status === "found");
        const selectedIssue = issueFromLegacyAsset(normalizeMarvelJpegUrl(label.art.asset), labelCovers);
        const selected = harvested.find(url => {
            const cover = labelCovers.find(entry => entry.cleanImageUrl === url);
            return String(cover?.issue) === selectedIssue;
        }) ?? harvested[0];
        if (selectedIssue) directOrIssueSelections += 1;
        else fallbackSelections += 1;
        const unchanged = label.art.options?.length === harvested.length
            && label.art.options.every((url, index) => url === harvested[index])
            && label.art.asset === selected;
        if (unchanged) continue;
        label.art.asset = selected;
        label.art.options = harvested;
        additions += harvested.length;
        touchedLabels += 1;
    }

    console.log(`${write ? "Applying" : "Would apply"} exact harvested option lists for ${touchedLabels} label(s) (${additions} URL(s)); selected covers: ${directOrIssueSelections} matched by URL/issue, ${fallbackSelections} first-issue fallback.`);
    if (write) writeCatalogJson(labelsPath, labels);
}

main();
