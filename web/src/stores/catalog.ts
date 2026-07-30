import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { EditorConfig, LabelConfig } from "../../../src/types";
import {
    type ArtUpdate,
    type CropUpdate,
    type EditorUpdates,
    type LayoutUpdate,
    isLiveEditor,
    requestLiveConfig,
    type ViewMode,
} from "../config";

type SaveState = "idle" | "saving" | "saved" | "error";

function cloneConfig(config: EditorConfig): EditorConfig {
    return structuredClone(config);
}

function copyCrop(crop: CropUpdate): CropUpdate {
    return {
        focus: { x: crop.focus.x, y: crop.focus.y },
        scale: crop.scale,
    };
}

function artForLabel(label: LabelConfig): ArtUpdate {
    return { asset: label.art.asset, crop: copyCrop(label.art.crop) };
}

function artsForConfig(config: EditorConfig): Record<string, ArtUpdate> {
    return Object.fromEntries(
        config.labels.map(label => [label.id, artForLabel(label)]),
    );
}

function cropsMatch(left: CropUpdate, right: CropUpdate): boolean {
    return left.focus.x === right.focus.x
        && left.focus.y === right.focus.y
        && left.scale === right.scale;
}

function artsMatch(left: ArtUpdate, right: ArtUpdate): boolean {
    return left.asset === right.asset && cropsMatch(left.crop, right.crop);
}

export const useCatalogStore = defineStore("catalog", () => {
    const config = ref<EditorConfig | undefined>(
        window.__COMIC_LABELS_CONFIG__
            ? cloneConfig(window.__COMIC_LABELS_CONFIG__)
            : undefined,
    );
    const view = ref<ViewMode>("editor");
    const savedArts = ref<Record<string, ArtUpdate>>(
        config.value ? artsForConfig(config.value) : {},
    );
    const pendingArts = ref<Record<string, ArtUpdate>>({});
    const sessionCrops = ref<Record<string, CropUpdate>>({});
    const pendingLayout = ref<LayoutUpdate>({});
    const saveState = ref<SaveState>("idle");
    const saveMessage = ref("");

    const labels = computed(() => config.value?.labels ?? []);
    const layout = computed(() => config.value?.layout);
    const isSaveAvailable = computed(() => isLiveEditor());
    const isSaving = computed(() => saveState.value === "saving");
    const pendingChangeCount = computed(() =>
        Object.keys(pendingArts.value).length
        + Object.keys(pendingLayout.value).length,
    );
    const hasPendingChanges = computed(() => pendingChangeCount.value > 0);

    function setConfig(nextConfig: EditorConfig): void {
        config.value = cloneConfig(nextConfig);
        savedArts.value = artsForConfig(config.value);
        pendingArts.value = {};
        sessionCrops.value = {};
        pendingLayout.value = {};
    }

    async function refreshFromServer(): Promise<void> {
        const liveConfig = await requestLiveConfig();
        if (liveConfig) setConfig(liveConfig);
    }

    function labelForId(id: string): LabelConfig {
        const label = config.value?.labels.find(candidate => candidate.id === id);
        if (!label) throw new Error(`Unknown label ID: ${id}`);
        return label;
    }

    function updateCrop(id: string, crop: CropUpdate): void {
        const label = labelForId(id);
        const nextCrop = copyCrop(crop);
        label.art.crop = { ...label.art.crop, ...nextCrop };
        sessionCrops.value = {
            ...sessionCrops.value,
            [`${id}\u0000${label.art.asset}`]: nextCrop,
        };
        const currentArt = artForLabel(label);
        const savedArt = savedArts.value[id];
        if (savedArt && artsMatch(currentArt, savedArt)) {
            const { [id]: _discarded, ...remainingArts } = pendingArts.value;
            pendingArts.value = remainingArts;
        } else {
            pendingArts.value = { ...pendingArts.value, [id]: currentArt };
        }
        saveState.value = "idle";
    }

    function selectArtwork(id: string, asset: string): void {
        const label = labelForId(id);
        if (asset === label.art.asset) return;
        const candidates = label.art.options ?? [];
        if (!candidates.includes(asset)) throw new Error(`Unknown artwork option for ${id}`);

        const currentCrop = copyCrop(label.art.crop);
        const nextCrop = sessionCrops.value[`${id}\u0000${asset}`]
            ?? { focus: { x: 0.5, y: 0.5 }, scale: 1 };
        sessionCrops.value = {
            ...sessionCrops.value,
            [`${id}\u0000${label.art.asset}`]: currentCrop,
        };
        label.art.asset = asset;
        updateCrop(id, nextCrop);
    }

    function revertCrop(id: string): void {
        const savedArt = savedArts.value[id];
        const label = labelForId(id);
        if (!savedArt) return;
        label.art.asset = savedArt.asset;
        updateCrop(id, savedArt.crop);
    }

    function isCropSaved(id: string): boolean {
        const savedArt = savedArts.value[id];
        return savedArt ? artsMatch(artForLabel(labelForId(id)), savedArt) : true;
    }

    function artworkUrl(asset: string): string {
        return config.value?.artworkUrls[asset] ?? asset;
    }

    function updateLayout(update: LayoutUpdate): void {
        if (!config.value) return;
        const layout = config.value.layout;
        if (update.artTreatment) layout.artTreatment = { ...update.artTreatment };
        if (update.identityBandHeightInches !== undefined) {
            layout.identityBand.heightInches = update.identityBandHeightInches;
        }
        if (update.metadataBandHeightInches !== undefined) {
            layout.metadataBand.heightInches = update.metadataBandHeightInches;
        }
        if (update.typography) layout.typography = { ...update.typography };
        if (update.logoPalette) layout.logoPalette = { ...update.logoPalette };
        if (update.logoOutline) layout.logoOutline = { ...update.logoOutline };
        pendingLayout.value = { ...pendingLayout.value, ...structuredClone(update) };
        saveState.value = "idle";
    }

    function saveStatus(): string {
        if (!isSaveAvailable.value) {
            return "Start the local editor with npm start to save configuration changes.";
        }
        if (saveState.value === "saving") return "Saving changes…";
        if (saveState.value === "error") return saveMessage.value;
        if (saveState.value === "saved") return saveMessage.value;
        if (hasPendingChanges.value) {
            return `${pendingChangeCount.value} change${pendingChangeCount.value === 1 ? "" : "s"} ready to save.`;
        }
        return "All changes are saved.";
    }

    async function saveChanges(): Promise<void> {
        if (!hasPendingChanges.value || !isSaveAvailable.value) return;

        const updates: EditorUpdates = {
            arts: pendingArts.value,
            layout: pendingLayout.value,
        };
        if (Object.keys(updates.arts ?? {}).length === 0) delete updates.arts;
        if (Object.keys(updates.layout ?? {}).length === 0) delete updates.layout;

        saveState.value = "saving";
        try {
            const response = await fetch("/api/edits", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            const result = await response.json() as {
                error?: string;
                saved?: { arts: number; layout: number };
            };
            if (!response.ok) throw new Error(result.error ?? "Unable to save configuration changes.");

            const savedCount = (result.saved?.arts ?? 0)
                + (result.saved?.layout ?? 0);
            if (updates.arts) {
                savedArts.value = {
                    ...savedArts.value,
                    ...Object.fromEntries(
                        Object.entries(updates.arts).map(([id, art]) => [id, {
                            asset: art.asset,
                            crop: copyCrop(art.crop),
                        }]),
                    ),
                };
            }
            pendingArts.value = {};
            pendingLayout.value = {};
            saveState.value = "saved";
            saveMessage.value = `Saved ${savedCount} change${savedCount === 1 ? "" : "s"} to configuration.`;
        } catch (error) {
            saveState.value = "error";
            const message = error instanceof Error ? error.message : "Unknown error";
            saveMessage.value = `Save failed: ${message}`;
        }
    }

    async function saveArtwork(id: string): Promise<void> {
        const art = pendingArts.value[id];
        if (!art || !isSaveAvailable.value || isSaving.value) return;

        const update: ArtUpdate = {
            asset: art.asset,
            crop: copyCrop(art.crop),
        };
        saveState.value = "saving";
        try {
            const response = await fetch("/api/edits", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ arts: { [id]: update } } satisfies EditorUpdates),
            });
            const result = await response.json() as {
                error?: string;
                saved?: { arts: number; layout: number };
            };
            if (!response.ok) throw new Error(result.error ?? "Unable to save artwork changes.");

            savedArts.value = { ...savedArts.value, [id]: update };
            if (artsMatch(artForLabel(labelForId(id)), update)) {
                const { [id]: _saved, ...remainingArts } = pendingArts.value;
                pendingArts.value = remainingArts;
            }
            saveState.value = "saved";
            saveMessage.value = `Saved cover and crop for ${id}.`;
        } catch (error) {
            saveState.value = "error";
            const message = error instanceof Error ? error.message : "Unknown error";
            saveMessage.value = `Save failed: ${message}`;
        }
    }

    return {
        config,
        labels,
        layout,
        view,
        isSaveAvailable,
        isSaving,
        pendingChangeCount,
        hasPendingChanges,
        refreshFromServer,
        saveChanges,
        saveArtwork,
        saveStatus,
        updateCrop,
        selectArtwork,
        revertCrop,
        isCropSaved,
        artworkUrl,
        updateLayout,
    };
});
