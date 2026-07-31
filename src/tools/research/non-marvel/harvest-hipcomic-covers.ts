import {
    countStatuses,
    readJson,
    readOptionalResearchInventory,
    writeResearchJson,
} from "../shared/inventory";
import { nonMarvelResearchPaths } from "../shared/paths";

const requestDelayMilliseconds = 500;
const headers = {
    "User-Agent": "Mozilla/5.0 (compatible; ComicLabelsCoverResearch/1.0)",
    Accept: "text/html",
};

type TargetRange = {
    labelId: string;
    series: string;
    queryTitle: string;
    issues: [number, number];
};

type Target = {
    labelId: string;
    series: string;
    issue: string;
    query: string;
};

type CoverEntry = Target & {
    status: "pending" | "found" | "not-found" | "fetch-error" | "blocked";
    listingUrl?: string;
    imageUrl?: string;
    error?: string;
    fetchedAt?: string;
    source?: string;
};

function usage(): never {
    console.error(`Usage: npm run harvest:non-marvel-covers -- [options]

Searches the configured HipComic target manifest sequentially. Existing results
are resumed by default; it stops immediately on a 403 or 429 response.

Options:
  --targets <path>  Target manifest override
  --out <path>      Cover inventory override
  --label <id>      Limit to one label; repeatable
  --limit <number>  Search at most this many pending targets
  --refresh         Re-query existing targets
  --help            Show this message
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
    const valueOptions = new Set(["--targets", "--out", "--label", "--limit"]);
    for (let index = 0; index < args.length; index += 1) {
        if (args[index] === "--refresh") continue;
        if (
            !valueOptions.has(args[index]) ||
            !args[index + 1] ||
            args[index + 1].startsWith("--")
        )
            usage();
        index += 1;
    }
}

function expandTargets(ranges: TargetRange[]): Target[] {
    return ranges.flatMap(range =>
        Array.from(
            { length: range.issues[1] - range.issues[0] + 1 },
            (_, offset) => ({
                labelId: range.labelId,
                series: range.series,
                issue: String(range.issues[0] + offset),
                query: `${range.queryTitle} ${range.issues[0] + offset}`,
            }),
        ),
    );
}

function keyFor(entry: Pick<Target, "labelId" | "series" | "issue">): string {
    return `${entry.labelId}|${entry.series}|${entry.issue}`;
}

function listingUrls(html: string): string[] {
    return [
        ...new Set(
            [...html.matchAll(/href="(\/listing\/[^"]+)"/g)].map(
                match => `https://www.hipcomic.com${match[1]}`,
            ),
        ),
    ];
}

function imageUrl(html: string): string | undefined {
    return html.match(/https:\/\/img\.hipcomic\.com\/p\/[a-f0-9]+\.jpg/)?.[0];
}

async function fetchText(
    url: string,
): Promise<{ status: number; text: string }> {
    const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(30_000),
    });
    return { status: response.status, text: await response.text() };
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);
    if (args.includes("--help")) usage();
    assertArguments(args);
    const targetsPath =
        singleValue(args, "--targets") ??
        nonMarvelResearchPaths.hipComicTargets;
    const outputPath =
        singleValue(args, "--out") ?? nonMarvelResearchPaths.covers;
    const selectedLabels = new Set(valuesFor(args, "--label"));
    const limitText = singleValue(args, "--limit");
    const limit =
        limitText === undefined ? Number.POSITIVE_INFINITY : Number(limitText);
    if (
        (!Number.isFinite(limit) && limit !== Number.POSITIVE_INFINITY) ||
        limit < 0 ||
        !Number.isInteger(limit)
    )
        usage();
    const refresh = args.includes("--refresh");

    const manifest = readJson<{ source?: string; targets?: TargetRange[] }>(
        targetsPath,
    );
    if (!Array.isArray(manifest.targets))
        throw new Error(`${targetsPath} does not contain a targets array.`);
    const allTargets = expandTargets(manifest.targets);
    const targets = allTargets.filter(
        target => !selectedLabels.size || selectedLabels.has(target.labelId),
    );
    const previous = readOptionalResearchInventory<CoverEntry>(outputPath);
    const previousByKey = new Map(
        (previous?.entries ?? []).map(entry => [keyFor(entry), entry]),
    );
    const targetKeys = new Set(allTargets.map(keyFor));
    const byKey = new Map(previousByKey);
    let attempts = 0;
    let requests = 0;
    let stoppedForBlocking = false;

    const fetchWithDelay = async (
        url: string,
    ): Promise<{ status: number; text: string }> => {
        if (requests > 0)
            await new Promise(resolve =>
                setTimeout(resolve, requestDelayMilliseconds),
            );
        requests += 1;
        return fetchText(url);
    };
    const allEntries = (): CoverEntry[] => [
        ...allTargets.map(
            target =>
                byKey.get(keyFor(target)) ?? {
                    ...target,
                    status: "pending" as const,
                },
        ),
        ...(previous?.entries ?? []).filter(
            entry => !targetKeys.has(keyFor(entry)),
        ),
    ];
    const persist = (): void =>
        writeResearchJson(outputPath, {
            generatedAt: new Date().toISOString(),
            source: manifest.source ?? "HipComic public listing pages",
            requestDelayMs: requestDelayMilliseconds,
            stoppedForBlocking,
            entries: allEntries(),
        });

    for (const target of targets) {
        if (attempts >= limit || stoppedForBlocking) break;
        const key = keyFor(target);
        if (previousByKey.has(key) && !refresh) continue;
        attempts += 1;
        process.stdout.write(
            `Searching ${target.labelId} ${target.series} #${target.issue}\n`,
        );
        try {
            const search = await fetchWithDelay(
                `https://www.hipcomic.com/search?keywords=${encodeURIComponent(target.query)}`,
            );
            if (search.status === 403 || search.status === 429) {
                stoppedForBlocking = true;
                byKey.set(key, {
                    ...target,
                    status: "blocked",
                    error: `HipComic returned HTTP ${search.status}`,
                    fetchedAt: new Date().toISOString(),
                });
                persist();
                break;
            }
            const candidates = listingUrls(search.text);
            let result: CoverEntry | undefined;
            for (const listingUrl of candidates.slice(0, 12)) {
                const detail = await fetchWithDelay(listingUrl);
                if (detail.status === 403 || detail.status === 429) {
                    stoppedForBlocking = true;
                    result = {
                        ...target,
                        status: "blocked",
                        listingUrl,
                        error: `HipComic returned HTTP ${detail.status}`,
                        fetchedAt: new Date().toISOString(),
                    };
                    break;
                }
                const cover = imageUrl(detail.text);
                if (
                    cover &&
                    new RegExp(`(?:^|[^0-9])${target.issue}(?:[^0-9]|$)`).test(
                        listingUrl,
                    )
                ) {
                    result = {
                        ...target,
                        status: "found",
                        listingUrl,
                        imageUrl: cover,
                        fetchedAt: new Date().toISOString(),
                        source: manifest.source,
                    };
                    break;
                }
            }
            byKey.set(
                key,
                result ?? {
                    ...target,
                    status: "not-found",
                    error: candidates.length
                        ? "No matching listing with a cover image"
                        : "No HipComic listings found",
                    fetchedAt: new Date().toISOString(),
                },
            );
        } catch (error) {
            byKey.set(key, {
                ...target,
                status: "fetch-error",
                error: error instanceof Error ? error.message : String(error),
                fetchedAt: new Date().toISOString(),
            });
        }
        persist();
    }

    persist();
    console.log(
        `Wrote ${outputPath}: ${JSON.stringify(countStatuses(allEntries()))}${stoppedForBlocking ? " (stopped after blocking)" : ""}`,
    );
}

void main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
