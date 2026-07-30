import { labels } from "../../core/config";
import { isCleanMarvelJpegUrl } from "../../core/assets";
import { readJson, readResearchInventory } from "../research/shared/inventory";
import { canonicalMarvelIssuePage, marvelEntryKey, type MarvelCoverEntry, type MarvelIssuePageEntry, type MarvelRun } from "../research/shared/marvel";
import { marvelHarvestPaths, marvelHarvestPlan } from "../research/marvel/plan";
import { nonMarvelResearchPaths } from "../research/shared/paths";

type NonMarvelCoverEntry = { labelId: string; series: string; issue: string; status: string; imageUrl?: string };
type NonMarvelTarget = { labelId: string; series: string; queryTitle: string; issues: [number, number] };
type NonMarvelProfile = { id: string; kind: string; source: string; labelIds?: string[]; labelPrefix?: string };

function pushUniqueError(errors: string[], seen: Set<string>, value: string, description: string): void {
    if (seen.has(value)) errors.push(`Duplicate ${description}: ${value}.`);
    else seen.add(value);
}

function validateMarvelPlan(labelIds: Set<string>, errors: string[]): void {
    for (const [labelId, seriesId] of Object.entries(marvelHarvestPlan.queue.seriesByLabel)) {
        if (!labelIds.has(labelId)) errors.push(`Marvel queue series mapping references unknown label ${labelId}.`);
        if (!Number.isInteger(seriesId) || seriesId <= 0) errors.push(`Marvel queue series mapping has invalid ID for ${labelId}.`);
    }
    const ids = new Set<string>();
    for (const run of marvelHarvestPlan.runs as MarvelRun[]) {
        pushUniqueError(errors, ids, run.id, "Marvel run ID");
        if (!labelIds.has(run.labelId)) errors.push(`Marvel run ${run.id} references unknown label ${run.labelId}.`);
        if (!Number.isInteger(run.seriesId) || run.seriesId <= 0) errors.push(`Marvel run ${run.id} has an invalid series ID.`);
        if (!Array.isArray(run.issues) || run.issues.length !== 2 || !Number.isInteger(run.issues[0])
            || !Number.isInteger(run.issues[1]) || run.issues[0] > run.issues[1]) {
            errors.push(`Marvel run ${run.id} has an invalid issue range.`);
        }
        for (const [issue, page] of Object.entries(run.officialPageOverrides ?? {})) {
            if (!Number.isInteger(Number(issue)) || !canonicalMarvelIssuePage(page)) {
                errors.push(`Marvel run ${run.id} has an invalid official-page override for #${issue}.`);
            }
        }
    }
}

function validateMarvelPages(name: string, entries: MarvelIssuePageEntry[], labelIds: Set<string>, errors: string[]): void {
    const keys = new Set<string>();
    for (const entry of entries) {
        pushUniqueError(errors, keys, marvelEntryKey(entry), `${name} page entry`);
        if (!entry.targetId) errors.push(`${name} page entry ${marvelEntryKey(entry)} has no stable target ID.`);
        if (!labelIds.has(entry.labelId)) errors.push(`${name} page entry references unknown label ${entry.labelId}.`);
        if (!String(entry.issue)) errors.push(`${name} page entry for ${entry.labelId} has no issue.`);
        if (entry.status === "found" && (!entry.officialPage || !canonicalMarvelIssuePage(entry.officialPage))) {
            errors.push(`${name} page entry ${marvelEntryKey(entry)} is found without a valid official Marvel page.`);
        }
    }
}

function validateMarvelCovers(name: string, entries: MarvelCoverEntry[], labelIds: Set<string>, errors: string[]): void {
    const keys = new Set<string>();
    for (const entry of entries) {
        pushUniqueError(errors, keys, marvelEntryKey(entry), `${name} cover entry`);
        if (!entry.targetId) errors.push(`${name} cover entry ${marvelEntryKey(entry)} has no stable target ID.`);
        if (!labelIds.has(entry.labelId)) errors.push(`${name} cover entry references unknown label ${entry.labelId}.`);
        if (entry.status === "found" && !isCleanMarvelJpegUrl(entry.cleanImageUrl)) {
            errors.push(`${name} cover entry ${marvelEntryKey(entry)} is found without a clean Marvel JPEG.`);
        }
    }
}

function validateNonMarvel(labelIds: Set<string>, errors: string[]): void {
    const targets = readJson<{ targets?: NonMarvelTarget[] }>(nonMarvelResearchPaths.hipComicTargets);
    if (!Array.isArray(targets.targets)) errors.push("Non-Marvel HipComic target manifest has no targets array.");
    else for (const target of targets.targets) {
        if (!labelIds.has(target.labelId)) errors.push(`Non-Marvel target references unknown label ${target.labelId}.`);
        if (!target.series || !target.queryTitle || target.issues[0] > target.issues[1]) {
            errors.push(`Non-Marvel target for ${target.labelId} is incomplete.`);
        }
    }

    const profileManifest = readJson<{ profiles?: NonMarvelProfile[] }>(nonMarvelResearchPaths.profiles);
    if (!Array.isArray(profileManifest.profiles)) errors.push("Non-Marvel profile manifest has no profiles array.");
    else {
        const ids = new Set<string>();
        for (const profile of profileManifest.profiles) {
            pushUniqueError(errors, ids, profile.id, "non-Marvel profile ID");
            if (!profile.source || !["direct-image", "fandom-api"].includes(profile.kind)) {
                errors.push(`Non-Marvel profile ${profile.id} is invalid.`);
            }
            for (const labelId of profile.labelIds ?? []) {
                if (!labelIds.has(labelId)) errors.push(`Non-Marvel profile ${profile.id} references unknown label ${labelId}.`);
            }
        }
    }

    const inventory = readResearchInventory<NonMarvelCoverEntry>(nonMarvelResearchPaths.covers);
    const keys = new Set<string>();
    for (const entry of inventory.entries) {
        const key = `${entry.labelId}|${entry.series}|${entry.issue}`;
        pushUniqueError(errors, keys, key, "non-Marvel cover entry");
        if (!labelIds.has(entry.labelId)) errors.push(`Non-Marvel cover entry references unknown label ${entry.labelId}.`);
        if (entry.status === "found" && !/^https?:\/\//i.test(entry.imageUrl ?? "")) {
            errors.push(`Non-Marvel cover entry ${key} is found without an image URL.`);
        }
    }
}

function main(): void {
    const errors: string[] = [];
    const labelIds = new Set(labels.map(label => label.id));
    validateMarvelPlan(labelIds, errors);
    validateMarvelPages("Marvel", readResearchInventory<MarvelIssuePageEntry>(marvelHarvestPaths.pages).entries, labelIds, errors);
    validateMarvelCovers("Marvel", readResearchInventory<MarvelCoverEntry>(marvelHarvestPaths.covers).entries, labelIds, errors);
    validateNonMarvel(labelIds, errors);
    if (errors.length > 0) throw new Error(`Research validation failed:\n- ${errors.join("\n- ")}`);
    console.log("Research validation passed for Marvel and non-Marvel inventories.");
}

try {
    main();
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
}
