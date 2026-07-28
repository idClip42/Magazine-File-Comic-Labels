import type { EditorConfig, LabelConfig, LayoutConfig } from "../../src/types";

export type ViewMode = "editor" | "shelves";

export type CropUpdate = Pick<LabelConfig["art"]["crop"], "focus" | "scale">;

export type EditorUpdates = {
    crops?: Record<string, CropUpdate>;
    identityBandHeightInches?: number;
};

export function staticAssetUrl(layout: LayoutConfig, asset: string): string {
    if (/^https?:\/\//i.test(asset)) return asset;
    return `../../${layout.localAssetRoot}/${asset}`;
}

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
