import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { EditorConfig, LabelConfig } from "../../../src/types";
import {
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

function cropsForConfig(config: EditorConfig): Record<string, CropUpdate> {
    return Object.fromEntries(
        config.labels.map(label => [label.id, copyCrop(label.art.crop)]),
    );
}

function cropsMatch(left: CropUpdate, right: CropUpdate): boolean {
    return left.focus.x === right.focus.x
        && left.focus.y === right.focus.y
        && left.scale === right.scale;
}

export const useCatalogStore = defineStore("catalog", () => {
    const config = ref<EditorConfig | undefined>(
        window.__COMIC_LABELS_CONFIG__
            ? cloneConfig(window.__COMIC_LABELS_CONFIG__)
            : undefined,
    );
    const view = ref<ViewMode>("editor");
    const savedCrops = ref<Record<string, CropUpdate>>(
        config.value ? cropsForConfig(config.value) : {},
    );
    const pendingCrops = ref<Record<string, CropUpdate>>({});
    const pendingLayout = ref<LayoutUpdate>({});
    const saveState = ref<SaveState>("idle");
    const saveMessage = ref("");

    const labels = computed(() => config.value?.labels ?? []);
    const layout = computed(() => config.value?.layout);
    const isSaveAvailable = computed(() => isLiveEditor());
    const pendingChangeCount = computed(() =>
        Object.keys(pendingCrops.value).length
        + Object.keys(pendingLayout.value).length,
    );
    const hasPendingChanges = computed(() => pendingChangeCount.value > 0);

    function setConfig(nextConfig: EditorConfig): void {
        config.value = cloneConfig(nextConfig);
        savedCrops.value = cropsForConfig(config.value);
        pendingCrops.value = {};
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
        const savedCrop = savedCrops.value[id];
        if (savedCrop && cropsMatch(nextCrop, savedCrop)) {
            const { [id]: _discarded, ...remainingCrops } = pendingCrops.value;
            pendingCrops.value = remainingCrops;
        } else {
            pendingCrops.value = { ...pendingCrops.value, [id]: nextCrop };
        }
        saveState.value = "idle";
    }

    function revertCrop(id: string): void {
        const savedCrop = savedCrops.value[id];
        if (savedCrop) updateCrop(id, savedCrop);
    }

    function isCropSaved(id: string): boolean {
        const savedCrop = savedCrops.value[id];
        return savedCrop ? cropsMatch(labelForId(id).art.crop, savedCrop) : true;
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
            crops: pendingCrops.value,
            layout: pendingLayout.value,
        };
        if (Object.keys(updates.crops ?? {}).length === 0) delete updates.crops;
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
                saved?: { crops: number; layout: number };
            };
            if (!response.ok) throw new Error(result.error ?? "Unable to save configuration changes.");

            const savedCount = (result.saved?.crops ?? 0)
                + (result.saved?.layout ?? 0);
            if (updates.crops) {
                savedCrops.value = {
                    ...savedCrops.value,
                    ...Object.fromEntries(
                        Object.entries(updates.crops).map(([id, crop]) => [id, copyCrop(crop)]),
                    ),
                };
            }
            pendingCrops.value = {};
            pendingLayout.value = {};
            saveState.value = "saved";
            saveMessage.value = `Saved ${savedCount} change${savedCount === 1 ? "" : "s"} to configuration.`;
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
        pendingChangeCount,
        hasPendingChanges,
        refreshFromServer,
        saveChanges,
        saveStatus,
        updateCrop,
        revertCrop,
        isCropSaved,
        updateLayout,
    };
});
