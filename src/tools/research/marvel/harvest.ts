import fs from "node:fs";
import {
    cleanMarvelCoverUrl,
    fetchMarvelCover,
    MARVEL_BLOCK_THRESHOLD,
    wait,
} from "./cover-discovery";
import { marvelHarvestPaths, marvelHarvestPlan, marvelHarvestPlanPath } from "./plan";
import { countStatuses, readOptionalResearchInventory, writeResearchJson } from "../shared/inventory";
import { canonicalMarvelIssuePage, marvelEntryKey, type MarvelCoverEntry, type MarvelIssuePageEntry } from "../shared/marvel";

type MetadataIssue = {
    issueNumber: string;
    detailUrl: string;
    seriesId: number;
    seriesName: string;
    title: string;
    onSaleDate?: string;
};

type PlannedTarget = {
    targetId: string;
    targetKind: "queue" | "run";
    labelId: string;
    issue: string | number;
    runId?: string;
    seriesId?: number;
    officialPage?: string;
    labelDescription?: string;
    query?: string;
};

type PageEntry = MarvelIssuePageEntry & {
    labelDescription?: string;
    query?: string;
    candidates?: string[];
    searchedAt?: string;
    error?: string;
    source?: "queue" | "metadata-api" | "serper" | "plan";
};

type PageProvider = "metadata-api" | "serper";

function usage(): never {
    console.error(`Usage: npm run harvest:marvel -- [options]

Runs the complete Marvel research pipeline from ${marvelHarvestPlanPath}: resolve
official issue pages, then extract their cover URLs. Both durable inventories
are checkpointed after every network request, so the next run resumes safely.

Options:
  --label <id>          Limit work to one label; repeatable
  --target <id>         Limit work to one plan target; repeatable
  --limit <number>      Limit both page resolutions and cover fetches
  --page-limit <number> Limit page resolutions only
  --cover-limit <number> Limit cover fetches only
  --delay-ms <number>   Delay between Marvel page requests; never below 500 ms
  --provider <name>     Queue-page resolver: metadata-api (default) or serper
  --concurrency <n>     Serper queue searches, 1-10 (default: 4)
  --refresh             Re-resolve found pages and re-fetch found covers
  --help                Show this message

Examples:
  npm run harvest:marvel -- --label fantastic-four-003 --limit 25
  npm run harvest:marvel -- --target run/ultimate-endgame-2025-1-5#1
`);
    process.exit(1);
}

function valuesFor(args: string[], name: string): string[] {
    const values: string[] = [];
    for (let index = 0; index < args.length; index += 1) {
        if (args[index] !== name) continue;
        const value = args[index + 1];
        if (!value || value.startsWith("--")) usage();
        values.push(value);
        index += 1;
    }
    return values;
}

function singleValue(args: string[], name: string): string | undefined {
    const values = valuesFor(args, name);
    if (values.length > 1) usage();
    return values[0];
}

function assertArguments(args: string[]): void {
    const optionsWithValue = new Set([
        "--label", "--target", "--limit", "--page-limit", "--cover-limit", "--delay-ms", "--provider", "--concurrency",
    ]);
    for (let index = 0; index < args.length; index += 1) {
        const argument = args[index];
        if (argument === "--refresh") continue;
        if (!optionsWithValue.has(argument) || !args[index + 1] || args[index + 1].startsWith("--")) usage();
        index += 1;
    }
}

function nonNegativeLimit(value: string | undefined): number {
    if (value === undefined) return Number.POSITIVE_INFINITY;
    const limit = Number(value);
    if ((!Number.isFinite(limit) && limit !== Number.POSITIVE_INFINITY) || limit < 0 || !Number.isInteger(limit)) usage();
    return limit;
}

function queryFromGoogleLink(link: string): string | undefined {
    try {
        const url = new URL(link);
        return url.hostname === "www.google.com" ? url.searchParams.get("q") ?? undefined : undefined;
    } catch {
        return undefined;
    }
}

function parseQueue(markdown: string): PlannedTarget[] {
    const entries: PlannedTarget[] = [];
    let labelId = "";
    let labelDescription = "";
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");

    for (let index = 0; index < lines.length; index += 1) {
        const heading = lines[index].match(/^### `([^`]+)`\s+(?:—|â€”)+\s+(.+)$/);
        if (heading) {
            [, labelId, labelDescription] = heading;
            continue;
        }

        const issue = lines[index].match(/^- \[[ x]\] #(.+?)\s+(?:—|â€”)+\s+\[[^\]]+\]\(([^)]+)\)$/);
        if (!issue || !labelId) continue;

        const [, issueNumber, discoveryLink] = issue;
        let officialPage = canonicalMarvelIssuePage(discoveryLink);
        for (let lookahead = index + 1; lookahead < lines.length && lines[lookahead].startsWith("  "); lookahead += 1) {
            const saved = lines[lookahead].match(/^  - Official Marvel page URL:\s*(\S+)?\s*$/);
            if (saved?.[1]) officialPage = canonicalMarvelIssuePage(saved[1]) ?? officialPage;
        }
        entries.push({
            targetId: `queue/${labelId}#${issueNumber}`,
            targetKind: "queue",
            labelId,
            issue: issueNumber,
            seriesId: marvelHarvestPlan.queue.seriesByLabel[labelId],
            labelDescription,
            officialPage,
            query: officialPage ? undefined : queryFromGoogleLink(discoveryLink),
        });
    }
    return entries;
}

function plannedTargets(): PlannedTarget[] {
    const queue = parseQueue(fs.readFileSync(marvelHarvestPaths.queue, "utf8"));
    const runs = marvelHarvestPlan.runs.flatMap(run => {
        const entries: PlannedTarget[] = [];
        for (let issue = run.issues[0]; issue <= run.issues[1]; issue += 1) {
            entries.push({
                targetId: `run/${run.id}#${issue}`,
                targetKind: "run",
                labelId: run.labelId,
                issue,
                runId: run.id,
                seriesId: run.seriesId,
                officialPage: canonicalMarvelIssuePage(run.officialPageOverrides?.[String(issue)] ?? ""),
            });
        }
        return entries;
    });
    const targets = [...queue, ...runs];
    const ids = new Set<string>();
    for (const target of targets) {
        if (ids.has(target.targetId)) throw new Error(`Duplicate Marvel harvest target ${target.targetId}.`);
        ids.add(target.targetId);
    }
    return targets;
}

function pageFromTarget(target: PlannedTarget, previous?: PageEntry): PageEntry {
    const configuredPage = target.officialPage;
    return {
        ...previous,
        ...target,
        officialPage: configuredPage ?? previous?.officialPage,
        status: configuredPage ? "found" : previous?.status ?? "pending",
        source: configuredPage ? "plan" : previous?.source,
        error: configuredPage ? undefined : previous?.error,
    };
}

async function fetchMetadataSeries(seriesId: number): Promise<MetadataIssue[]> {
    const response = await fetch(`https://marvel.emreparker.com/v1/series/${seriesId}/issues?limit=500`);
    if (!response.ok) throw new Error(`Metadata API returned HTTP ${response.status} for series ${seriesId}`);
    return ((await response.json()) as { items?: MetadataIssue[] }).items ?? [];
}

async function searchSerper(query: string, apiKey: string): Promise<string[]> {
    const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
        body: JSON.stringify({ q: query, num: 10 }),
    });
    if (!response.ok) throw new Error(`Serper returned HTTP ${response.status}`);
    const payload = (await response.json()) as { organic?: Array<{ link?: string }> };
    return [...new Set((payload.organic ?? [])
        .map(result => canonicalMarvelIssuePage(result.link ?? ""))
        .filter((url): url is string => Boolean(url)))];
}

function targetIsSelected(target: PlannedTarget, labels: Set<string>, targetIds: Set<string>): boolean {
    return (!labels.size || labels.has(target.labelId)) && (!targetIds.size || targetIds.has(target.targetId));
}

async function resolvePages(
    targets: PlannedTarget[],
    pageByKey: Map<string, PageEntry>,
    options: { labels: Set<string>; targetIds: Set<string>; limit: number; provider: PageProvider; concurrency: number; refresh: boolean },
): Promise<void> {
    const selected = targets.filter(target => targetIsSelected(target, options.labels, options.targetIds));
    const unresolved = selected.filter(target => {
        const page = pageByKey.get(target.targetId)!;
        return options.refresh || !canonicalMarvelIssuePage(page.officialPage ?? "");
    });
    const metadataTargets = unresolved.filter(target => target.seriesId && (target.targetKind === "run" || options.provider === "metadata-api"))
        .slice(0, options.limit);
    const seriesIds = [...new Set(metadataTargets.map(target => target.seriesId!))];
    const metadata = new Map<number, MetadataIssue[]>();
    const metadataErrors = new Map<number, string>();

    await Promise.all(seriesIds.map(async seriesId => {
        try {
            metadata.set(seriesId, await fetchMetadataSeries(seriesId));
        } catch (error) {
            metadataErrors.set(seriesId, error instanceof Error ? error.message : String(error));
        }
    }));

    let attempts = 0;
    for (const target of metadataTargets) {
        if (attempts >= options.limit) break;
        attempts += 1;
        const key = target.targetId;
        const requestError = metadataErrors.get(target.seriesId!);
        if (requestError) {
            pageByKey.set(key, { ...pageByKey.get(key)!, status: "error", source: "metadata-api", error: requestError });
            continue;
        }
        const match = metadata.get(target.seriesId!)?.find(issue => issue.issueNumber === String(target.issue));
        const officialPage = canonicalMarvelIssuePage(match?.detailUrl ?? "");
        pageByKey.set(key, {
            ...pageByKey.get(key)!,
            status: officialPage ? "found" : "not-found",
            officialPage,
            source: "metadata-api",
            seriesId: target.seriesId,
            seriesName: match?.seriesName,
            title: match?.title,
            onSaleDate: match?.onSaleDate,
            error: officialPage ? undefined : `Issue not present in metadata series ${target.seriesId}`,
        });
    }

    if (options.provider !== "serper" || attempts >= options.limit) return;
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) throw new Error("SERPER_API_KEY is required for --provider serper.");
    const serperApiKey: string = apiKey;
    const serperTargets = unresolved
        .filter(target => target.targetKind === "queue" && Boolean(target.query))
        .slice(0, options.limit - attempts);
    let next = 0;
    async function worker(): Promise<void> {
        while (next < serperTargets.length) {
            const target = serperTargets[next++];
            process.stdout.write(`Searching ${target.targetId}\n`);
            try {
                const candidates = await searchSerper(target.query!, serperApiKey);
                pageByKey.set(target.targetId, {
                    ...pageByKey.get(target.targetId)!,
                    status: candidates.length === 1 ? "found" : candidates.length ? "ambiguous" : "not-found",
                    officialPage: candidates.length === 1 ? candidates[0] : undefined,
                    source: "serper",
                    candidates,
                    searchedAt: new Date().toISOString(),
                    error: candidates.length ? undefined : "No canonical Marvel issue URL found in search results",
                });
            } catch (error) {
                pageByKey.set(target.targetId, {
                    ...pageByKey.get(target.targetId)!,
                    status: "error",
                    source: "serper",
                    searchedAt: new Date().toISOString(),
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        }
    }
    await Promise.all(Array.from({ length: Math.min(options.concurrency, serperTargets.length) }, worker));
}

function writePages(targets: PlannedTarget[], pageByKey: Map<string, PageEntry>): PageEntry[] {
    const entries = targets.map(target => pageByKey.get(target.targetId)!);
    writeResearchJson(marvelHarvestPaths.pages, {
        generatedAt: new Date().toISOString(),
        source: marvelHarvestPlanPath,
        entries,
    });
    return entries;
}

async function harvestCovers(
    pages: PageEntry[],
    labels: Set<string>,
    targetIds: Set<string>,
    limit: number,
    delayMilliseconds: number,
    refresh: boolean,
): Promise<void> {
    const eligible = pages.filter(page => page.status === "found" && canonicalMarvelIssuePage(page.officialPage ?? ""));
    const selected = eligible.filter(page =>
        (!labels.size || labels.has(page.labelId)) && (!targetIds.size || targetIds.has(page.targetId ?? marvelEntryKey(page))));
    const previous = readOptionalResearchInventory<MarvelCoverEntry>(marvelHarvestPaths.covers);
    const byKey = new Map((previous?.entries ?? []).map(entry => [marvelEntryKey(entry), entry]));
    let attempts = 0;
    let consecutiveBlocks = 0;
    let stoppedForBlocking = false;

    const entries = (): MarvelCoverEntry[] => eligible.map(page => {
        const key = marvelEntryKey(page);
        const previousCover = byKey.get(key);
        return {
            ...previousCover,
            ...page,
            status: previousCover?.status ?? "pending",
        } as MarvelCoverEntry;
    });
    const writeProgress = (): void => {
        writeResearchJson(marvelHarvestPaths.covers, {
            generatedAt: new Date().toISOString(),
            source: marvelHarvestPlanPath,
            requestDelayMs: delayMilliseconds,
            stoppedForBlocking,
            entries: entries(),
        });
    };

    for (const page of selected) {
        if (attempts >= limit || stoppedForBlocking) break;
        const key = marvelEntryKey(page);
        const existing = byKey.get(key);
        if (existing?.status === "found" && !refresh) continue;
        if (attempts > 0) await wait(delayMilliseconds);
        attempts += 1;
        process.stdout.write(`Fetching ${key}\n`);
        try {
            const result = await fetchMarvelCover(page.officialPage!);
            const blocked = result.status === 403 || result.status === 429;
            consecutiveBlocks = blocked ? consecutiveBlocks + 1 : 0;
            const status: MarvelCoverEntry["status"] = blocked
                ? "blocked"
                : result.status >= 400 ? "fetch-error"
                    : result.cover ? "found" : "no-cover-found";
            byKey.set(key, {
                ...page,
                status,
                sourceImageUrl: result.cover,
                cleanImageUrl: result.cover ? cleanMarvelCoverUrl(result.cover) : undefined,
                extractedAt: new Date().toISOString(),
                error: result.status >= 400
                    ? `Marvel returned HTTP ${result.status}`
                    : result.cover ? undefined : "No Marvel CDN cover URL found in page HTML",
            });
            stoppedForBlocking = consecutiveBlocks >= MARVEL_BLOCK_THRESHOLD;
        } catch (error) {
            byKey.set(key, {
                ...page,
                status: "fetch-error",
                extractedAt: new Date().toISOString(),
                error: error instanceof Error ? error.message : String(error),
            });
        }
        writeProgress();
    }

    writeProgress();
    console.log(`Covers: ${JSON.stringify(countStatuses(entries()))}${stoppedForBlocking ? " (stopped after repeated blocking)" : ""}`);
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);
    if (args.includes("--help")) usage();
    assertArguments(args);
    const commonLimit = singleValue(args, "--limit");
    const pageLimit = nonNegativeLimit(singleValue(args, "--page-limit") ?? commonLimit);
    const coverLimit = nonNegativeLimit(singleValue(args, "--cover-limit") ?? commonLimit);
    const delayMilliseconds = Number(singleValue(args, "--delay-ms") ?? marvelHarvestPlan.coverRequestDelayMs);
    const provider = singleValue(args, "--provider") ?? "metadata-api";
    const concurrency = Number(singleValue(args, "--concurrency") ?? "4");
    if (!Number.isInteger(delayMilliseconds) || delayMilliseconds < 500
        || (provider !== "metadata-api" && provider !== "serper")
        || !Number.isInteger(concurrency) || concurrency < 1 || concurrency > 10) usage();

    const labels = new Set(valuesFor(args, "--label"));
    const targetIds = new Set(valuesFor(args, "--target"));
    const refresh = args.includes("--refresh");
    const targets = plannedTargets();
    const previousPages = readOptionalResearchInventory<PageEntry>(marvelHarvestPaths.pages);
    const priorByKey = new Map((previousPages?.entries ?? []).map(entry => [marvelEntryKey(entry), entry]));
    const pageByKey = new Map(targets.map(target => [target.targetId, pageFromTarget(target, priorByKey.get(target.targetId))]));

    await resolvePages(targets, pageByKey, { labels, targetIds, limit: pageLimit, provider, concurrency, refresh });
    const pages = writePages(targets, pageByKey);
    console.log(`Pages: ${JSON.stringify(countStatuses(pages))}`);
    await harvestCovers(pages, labels, targetIds, coverLimit, delayMilliseconds, refresh);
}

void main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
