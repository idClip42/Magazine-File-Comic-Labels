export type MarvelIssuePageEntry = {
    /** Stable identity across queue-backed and explicit-run targets. */
    targetId?: string;
    labelId: string;
    issue: string | number;
    officialPage?: string;
    status: string;
    runId?: string;
    title?: string;
    seriesId?: number;
    seriesName?: string;
    onSaleDate?: string;
};

export type MarvelCoverEntry = MarvelIssuePageEntry & {
    status: "pending" | "found" | "no-cover-found" | "fetch-error" | "blocked";
    sourceImageUrl?: string;
    cleanImageUrl?: string;
    extractedAt?: string;
    error?: string;
};

export type MarvelRun = {
    id: string;
    labelId: string;
    seriesId: number;
    issues: [number, number];
    officialPageOverrides?: Record<string, string>;
};

export function marvelEntryKey(entry: Pick<MarvelIssuePageEntry, "labelId" | "issue" | "runId" | "targetId">): string {
    return entry.targetId ?? (entry.runId ? `${entry.runId}#${entry.issue}` : `${entry.labelId}#${entry.issue}`);
}

export function canonicalMarvelIssuePage(value: string): string | undefined {
    try {
        const url = new URL(value);
        if (url.hostname !== "www.marvel.com" || !/^\/comics\/issue\/\d+(?:\/|$)/.test(url.pathname)) return undefined;
        url.search = "";
        url.hash = "";
        return url.toString().replace(/\/$/, "");
    } catch {
        return undefined;
    }
}
