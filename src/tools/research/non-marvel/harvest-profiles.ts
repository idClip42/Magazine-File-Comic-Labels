import {
    countStatuses,
    readJson,
    readResearchInventory,
    writeResearchJson,
} from "../shared/inventory";
import { nonMarvelResearchPaths } from "../shared/paths";

const requestDelayMilliseconds = 500;
const headers = {
    "User-Agent": "Mozilla/5.0 (compatible; ComicLabelsCoverResearch/1.0)",
};

type CoverEntry = {
    labelId: string;
    series: string;
    issue: string;
    status: string;
    imageUrl?: string;
    listingUrl?: string;
    source?: string;
    fetchedAt?: string;
    error?: string;
    [key: string]: unknown;
};

type Extension = { labelId: string; series: string; issues: [number, number] };
type DirectImageProfile = {
    id: string;
    kind: "direct-image";
    labelIds: string[];
    extend?: Extension;
    imageUrlTemplate: string;
    listingUrl: string;
    source: string;
};
type FandomApiProfile = {
    id: string;
    kind: "fandom-api";
    labelIds?: string[];
    labelPrefix?: string;
    apiUrl: string;
    pageTemplate: string;
    coverPattern: string;
    excludePattern?: string;
    replace?: Record<string, string>;
    source: string;
};
type DcUniverseInfiniteProfile = {
    id: string;
    kind: "dc-universe-infinite";
    labelIds: string[];
    seriesUrl: string;
    pages: number;
    issueTitlePrefix: string;
    source: string;
};
type Profile = DirectImageProfile | FandomApiProfile | DcUniverseInfiniteProfile;

function usage(): never {
    console.error(`Usage: npm run harvest:non-marvel-profile -- --profile <name> [options]

Applies one configured, source-specific research profile to the common
non-Marvel cover inventory. Profiles keep host-specific parsing as data while
sharing resume, rate-limit, and persistence behavior.

Options:
  --profile <name>  Required profile ID
  --out <path>      Cover inventory override
  --limit <number>  Visit at most this many pending issues
  --refresh         Revisit entries already found by this profile
  --help            Show this message
`);
    process.exit(1);
}

function optionValue(args: string[], name: string): string | undefined {
    const matches = args.flatMap((argument, index) =>
        argument === name ? [args[index + 1]] : [],
    );
    if (
        matches.length > 1 ||
        matches.some(value => !value || value.startsWith("--"))
    )
        usage();
    return matches[0];
}

function matchesProfile(entry: CoverEntry, profile: Profile): boolean {
    return profile.kind === "direct-image" || profile.kind === "dc-universe-infinite"
        ? profile.labelIds.includes(entry.labelId)
        : (profile.labelIds?.includes(entry.labelId) ?? false) ||
              (profile.labelPrefix !== undefined &&
                  entry.labelId.startsWith(profile.labelPrefix));
}

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** DCUI's query parameters are Imgix transformations; the path is the source JPEG. */
function canonicalDcUniverseInfiniteImage(url: string): string {
    const canonical = new URL(url.split("&amp;").join("&"));
    if (
        canonical.hostname !== "imgix-media.wbdndc.net" ||
        !canonical.pathname.startsWith("/ingest/book/preview/") ||
        !canonical.pathname.endsWith("/0.jpg")
    )
        throw new Error("DC Universe Infinite returned an unexpected cover URL.");
    canonical.search = "";
    canonical.hash = "";
    return canonical.toString();
}

function applyReplacements(
    value: string,
    replacements: Record<string, string> | undefined,
): string {
    return Object.entries(replacements ?? {}).reduce(
        (result, [search, replacement]) =>
            result.split(search).join(replacement),
        value,
    );
}

function appendExtension(
    entries: CoverEntry[],
    extension: Extension | undefined,
): void {
    if (!extension) return;
    for (
        let issue = extension.issues[0];
        issue <= extension.issues[1];
        issue += 1
    ) {
        if (
            !entries.some(
                entry =>
                    entry.labelId === extension.labelId &&
                    entry.issue === String(issue),
            )
        ) {
            entries.push({
                labelId: extension.labelId,
                series: extension.series,
                issue: String(issue),
                status: "pending",
            });
        }
    }
}

async function fetchFandomCover(
    entry: CoverEntry,
    profile: FandomApiProfile,
): Promise<{ imageUrl: string; listingUrl: string }> {
    const endpoint = new URL(profile.apiUrl);
    endpoint.searchParams.set("action", "parse");
    endpoint.searchParams.set(
        "page",
        profile.pageTemplate.replace("{issue}", entry.issue),
    );
    endpoint.searchParams.set("prop", "text");
    endpoint.searchParams.set("format", "json");
    const response = await fetch(endpoint, {
        headers,
        signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok)
        throw new Error(`Fandom returned HTTP ${response.status}`);
    const payload = (await response.json()) as {
        parse?: { text?: { "*"?: string } };
    };
    const html = payload.parse?.text?.["*"] ?? "";
    const candidates = [
        ...html.matchAll(new RegExp(profile.coverPattern, "g")),
    ].map(match => applyReplacements(match[0], profile.replace));
    const excluded = profile.excludePattern
        ? new RegExp(profile.excludePattern, "i")
        : undefined;
    const imageUrl = candidates.find(candidate => !excluded?.test(candidate));
    if (!imageUrl)
        throw new Error(
            `No standard cover image found for ${entry.labelId} #${entry.issue}.`,
        );
    return { imageUrl, listingUrl: endpoint.toString() };
}

async function fetchDirectCover(
    entry: CoverEntry,
    profile: DirectImageProfile,
): Promise<{ imageUrl: string; listingUrl: string }> {
    const imageUrl = profile.imageUrlTemplate.replace("{issue}", entry.issue);
    const response = await fetch(imageUrl, {
        headers,
        signal: AbortSignal.timeout(30_000),
    });
    if (
        !response.ok ||
        !response.headers.get("content-type")?.startsWith("image/")
    ) {
        throw new Error(
            `Direct image source did not return an image for ${entry.labelId} #${entry.issue}.`,
        );
    }
    return { imageUrl, listingUrl: profile.listingUrl };
}

async function fetchDcUniverseInfiniteCovers(
    profile: DcUniverseInfiniteProfile,
): Promise<Map<string, { imageUrl: string; listingUrl: string }>> {
    const title = escapeRegex(profile.issueTitlePrefix);
    const covers = new Map<string, { imageUrl: string; listingUrl: string }>();
    for (let page = 1; page <= profile.pages; page += 1) {
        if (page > 1)
            await new Promise(resolve =>
                setTimeout(resolve, requestDelayMilliseconds),
            );
        const pageUrl = new URL(profile.seriesUrl);
        pageUrl.searchParams.set("page", String(page));
        const response = await fetch(pageUrl, {
            headers,
            signal: AbortSignal.timeout(30_000),
        });
        if (!response.ok)
            throw new Error(
                `DC Universe Infinite returned HTTP ${response.status} for page ${page}`,
            );
        const html = await response.text();
        const matches = [
            ...html.matchAll(
                new RegExp(
                    `href="([^\"]+)"[^>]*aria-label="${title} #(\\d+)"[\\s\\S]*?<img src="([^\"]+)"`,
                    "g",
                ),
            ),
        ];
        for (const match of matches) {
            const issue = match[2];
            const imageUrl = canonicalDcUniverseInfiniteImage(match[3]);
            covers.set(issue, {
                imageUrl,
                listingUrl: new URL(match[1], profile.seriesUrl).toString(),
            });
        }
    }
    if (covers.size === 0)
        throw new Error("No DC Universe Infinite issue covers were found.");
    return covers;
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);
    if (args.includes("--help")) usage();
    const allowed = new Set(["--profile", "--out", "--limit", "--refresh"]);
    for (let index = 0; index < args.length; index += 1) {
        if (!allowed.has(args[index])) usage();
        if (args[index] !== "--refresh") {
            if (!args[index + 1] || args[index + 1].startsWith("--")) usage();
            index += 1;
        }
    }
    const profileId = optionValue(args, "--profile");
    if (!profileId) usage();
    const outputPath =
        optionValue(args, "--out") ?? nonMarvelResearchPaths.covers;
    const limitText = optionValue(args, "--limit");
    const limit =
        limitText === undefined ? Number.POSITIVE_INFINITY : Number(limitText);
    if (
        (!Number.isFinite(limit) && limit !== Number.POSITIVE_INFINITY) ||
        limit < 0 ||
        (Number.isFinite(limit) && !Number.isInteger(limit))
    )
        usage();
    const profileManifest = readJson<{ profiles?: Profile[] }>(
        nonMarvelResearchPaths.profiles,
    );
    const profile = profileManifest.profiles?.find(
        candidate => candidate.id === profileId,
    );
    if (!profile) throw new Error(`Unknown non-Marvel profile: ${profileId}`);
    const inventory = readResearchInventory<CoverEntry>(outputPath);
    appendExtension(
        inventory.entries,
        profile.kind === "direct-image" ? profile.extend : undefined,
    );

    const refresh = args.includes("--refresh");
    const dcCovers =
        profile.kind === "dc-universe-infinite"
            ? await fetchDcUniverseInfiniteCovers(profile)
            : undefined;
    let attempts = 0;
    let requests = 0;
    let stoppedForBlocking = false;
    for (const entry of inventory.entries) {
        if (
            !matchesProfile(entry, profile) ||
            attempts >= limit ||
            stoppedForBlocking
        )
            continue;
        if (
            entry.status === "found" &&
            entry.source === profile.source &&
            !refresh
        )
            continue;
        if (requests > 0)
            await new Promise(resolve =>
                setTimeout(resolve, requestDelayMilliseconds),
            );
        requests += 1;
        attempts += 1;
        process.stdout.write(
            `Fetching ${profile.id}: ${entry.labelId} #${entry.issue}\n`,
        );
        try {
            const result =
                profile.kind === "fandom-api"
                    ? await fetchFandomCover(entry, profile)
                    : profile.kind === "direct-image"
                      ? await fetchDirectCover(entry, profile)
                      : dcCovers?.get(entry.issue) ?? (() => {
                            throw new Error(
                                `DC Universe Infinite has no matching cover for ${entry.labelId} #${entry.issue}.`,
                            );
                        })();
            entry.status = "found";
            entry.imageUrl = result.imageUrl;
            entry.listingUrl = result.listingUrl;
            entry.source = profile.source;
            entry.fetchedAt = new Date().toISOString();
            delete entry.error;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            entry.status = /HTTP (403|429)/.test(message)
                ? "blocked"
                : "fetch-error";
            entry.error = message;
            entry.fetchedAt = new Date().toISOString();
            stoppedForBlocking = entry.status === "blocked";
        }
        writeResearchJson(outputPath, {
            ...inventory,
            generatedAt: new Date().toISOString(),
            source: `Non-Marvel research profile: ${profile.id}`,
            requestDelayMs: requestDelayMilliseconds,
            stoppedForBlocking,
        });
    }
    writeResearchJson(outputPath, {
        ...inventory,
        generatedAt: new Date().toISOString(),
        source: `Non-Marvel research profile: ${profile.id}`,
        requestDelayMs: requestDelayMilliseconds,
        stoppedForBlocking,
    });
    console.log(
        `Wrote ${outputPath}: ${JSON.stringify(countStatuses(inventory.entries))}${stoppedForBlocking ? " (stopped after blocking)" : ""}`,
    );
}

void main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
