import type { EditorConfig } from "../../src/core/types";
import type { EditorUpdates, LayoutUpdate } from "../../src/core/editor-updates";

export type ViewMode = "editor" | "shelves";

export type { EditorUpdates, LayoutUpdate };

export function isLiveEditor(): boolean {
    return window.location.protocol === "http:" || window.location.protocol === "https:";
}

export async function requestLiveConfig(): Promise<EditorConfig | undefined> {
    if (!isLiveEditor()) return undefined;

    try {
        const response = await fetch("/api/config", { cache: "no-store" });
        if (!response.ok) return undefined;
        return response.json() as Promise<EditorConfig>;
    } catch {
        // The embedded build snapshot remains usable when no editor server is present.
        return undefined;
    }
}
