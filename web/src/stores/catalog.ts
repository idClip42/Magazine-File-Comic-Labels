import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { EditorConfig, LabelConfig } from "../../../src/types";
import {
    type CropUpdate,
    type EditorUpdates,
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

export const useCatalogStore = defineStore("catalog", () => {
    const config = ref<EditorConfig | undefined>(
        window.__COMIC_LABELS_CONFIG__
            ? cloneConfig(window.__COMIC_LABELS_CONFIG__)
            : undefined,
    );
    const view = ref<ViewMode>("editor");
    const pendingCrops = ref<Record<string, CropUpdate>>({});
    const pendingIdentityBandHeight = ref<number | undefined>();
    const isAdjustingIdentityBand = ref(false);
    const saveState = ref<SaveState>("idle");
    const saveMessage = ref("");
    let identityLogoRestoreFrame: number | undefined;

    const labels = computed(() => config.value?.labels ?? []);
    const layout = computed(() => config.value?.layout);
    const isSaveAvailable = computed(() => isLiveEditor());
    const pendingChangeCount = computed(() =>
        Object.keys(pendingCrops.value).length
        + (pendingIdentityBandHeight.value === undefined ? 0 : 1),
    );
    const hasPendingChanges = computed(() => pendingChangeCount.value > 0);

    function setConfig(nextConfig: EditorConfig): void {
        config.value = cloneConfig(nextConfig);
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
        label.art.crop = { ...label.art.crop, ...copyCrop(crop) };
        pendingCrops.value = { ...pendingCrops.value, [id]: copyCrop(crop) };
        saveState.value = "idle";
    }

    function updateIdentityBandHeight(height: number): void {
        if (!config.value || !Number.isFinite(height)) return;
        config.value.layout.identityBand.heightInches = height;
        pendingIdentityBandHeight.value = height;
        saveState.value = "idle";
    }

    /**
     * Resizing the identity band invalidates every inline SVG in the shelf
     * overview. Keep their inexpensive layout proxy visible during a drag and
     * let the browser repaint the real logos only after it settles.
     */
    function beginIdentityBandAdjustment(): void {
        if (identityLogoRestoreFrame !== undefined) {
            window.cancelAnimationFrame(identityLogoRestoreFrame);
            identityLogoRestoreFrame = undefined;
        }
        isAdjustingIdentityBand.value = true;
    }

    function endIdentityBandAdjustment(): void {
        if (!isAdjustingIdentityBand.value || identityLogoRestoreFrame !== undefined) return;
        identityLogoRestoreFrame = window.requestAnimationFrame(() => {
            isAdjustingIdentityBand.value = false;
            identityLogoRestoreFrame = undefined;
        });
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
            identityBandHeightInches: pendingIdentityBandHeight.value,
        };
        if (Object.keys(updates.crops ?? {}).length === 0) delete updates.crops;
        if (updates.identityBandHeightInches === undefined) {
            delete updates.identityBandHeightInches;
        }

        saveState.value = "saving";
        try {
            const response = await fetch("/api/edits", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            const result = await response.json() as {
                error?: string;
                saved?: { crops: number; identityBand: boolean };
            };
            if (!response.ok) throw new Error(result.error ?? "Unable to save configuration changes.");

            const savedCount = (result.saved?.crops ?? 0)
                + (result.saved?.identityBand ? 1 : 0);
            pendingCrops.value = {};
            pendingIdentityBandHeight.value = undefined;
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
        isAdjustingIdentityBand,
        isSaveAvailable,
        pendingChangeCount,
        hasPendingChanges,
        refreshFromServer,
        saveChanges,
        saveStatus,
        updateCrop,
        updateIdentityBandHeight,
        beginIdentityBandAdjustment,
        endIdentityBandAdjustment,
    };
});
