import fs from "node:fs";
import path from "node:path";

export type ResearchInventory<TEntry> = {
    generatedAt: string;
    source: string;
    entries: TEntry[];
    [key: string]: unknown;
};

export function readJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function readResearchInventory<TEntry>(
    filePath: string,
): ResearchInventory<TEntry> {
    const inventory = readJson<Partial<ResearchInventory<TEntry>>>(filePath);
    if (!Array.isArray(inventory.entries)) {
        throw new Error(`${filePath} does not contain an entries array.`);
    }
    return inventory as ResearchInventory<TEntry>;
}

export function readOptionalResearchInventory<TEntry>(
    filePath: string,
): ResearchInventory<TEntry> | undefined {
    return fs.existsSync(filePath)
        ? readResearchInventory<TEntry>(filePath)
        : undefined;
}

/** Keeps durable harvest inventories intact if a process is interrupted while writing. */
export function writeResearchJson(filePath: string, value: unknown): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const lineEnding =
        fs.existsSync(filePath) &&
        fs.readFileSync(filePath, "utf8").includes("\r\n")
            ? "\r\n"
            : "\n";
    const temporaryPath = `${filePath}.tmp`;
    fs.writeFileSync(
        temporaryPath,
        `${JSON.stringify(value, null, 4)}${lineEnding}`,
        "utf8",
    );
    // Windows virus scanning can briefly lock a just-written durable inventory.
    // Retry the atomic replacement rather than discarding a completed harvest.
    let lastError: unknown;
    for (let attempt = 0; attempt < 10; attempt += 1) {
        try {
            fs.renameSync(temporaryPath, filePath);
            return;
        } catch (error) {
            lastError = error;
            if (!(error instanceof Error) || !/^(EPERM|EACCES)$/.test((error as NodeJS.ErrnoException).code ?? ""))
                throw error;
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
        }
    }
    throw lastError;
}

export function countStatuses(
    entries: Array<{ status: string }>,
): Record<string, number> {
    return entries.reduce<Record<string, number>>((counts, entry) => {
        counts[entry.status] = (counts[entry.status] ?? 0) + 1;
        return counts;
    }, {});
}
