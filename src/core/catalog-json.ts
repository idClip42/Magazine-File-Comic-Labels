import fs from "node:fs";

/** Keep compact numeric ranges readable in the hand-maintained catalog JSON. */
export function formatCatalogJson(value: unknown, lineEnding = "\n"): string {
    const expanded = JSON.stringify(value, null, 4);
    const compactRanges = expanded.replace(
        /\[\n\s+(-?\d+(?:\.\d+)?),\n\s+(-?\d+(?:\.\d+)?)\n\s+\]/g,
        "[$1, $2]",
    );
    return `${compactRanges}${lineEnding}`;
}

export function lineEndingFor(source: string): string {
    return source.includes("\r\n") ? "\r\n" : "\n";
}

/** Write through a neighbouring temporary file so interrupted editor saves do not truncate configuration. */
export function writeCatalogJson(filePath: string, value: unknown): void {
    const source = fs.readFileSync(filePath, "utf8");
    const temporaryPath = `${filePath}.tmp`;
    fs.writeFileSync(temporaryPath, formatCatalogJson(value, lineEndingFor(source)), "utf8");
    fs.renameSync(temporaryPath, filePath);
}
