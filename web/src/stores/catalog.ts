import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { normalizeManualArtworkUrl } from "../../../src/core/assets";
import type { ArtUpdate, CropUpdate } from "../../../src/core/editor-updates";
import {
    layoutForVariant,
    type DesignVariant,
    type EditorConfig,
    type LabelConfig,
} from "../../../src/core/types";
import {
    isLiveEditor,
    requestLiveConfig,
    type EditorUpdates,
    type LayoutUpdate,
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
    return {
        asset: label.art.asset,
        crop: copyCrop(label.art.crop),
        ...(label.art.options ? { options: [...label.art.options] } : {}),
    };
}

function artsForConfig(config: EditorConfig): Record<string, ArtUpdate> {
    return Object.fromEntries(
        config.labels.map(label => [label.id, artForLabel(label)]),
    );
}

function cropsMatch(left: CropUpdate, right: CropUpdate): boolean {
    return (
        left.focus.x === right.focus.x &&
        left.focus.y === right.focus.y &&
        left.scale === right.scale
    );
}

function artsMatch(left: ArtUpdate, right: ArtUpdate): boolean {
    const leftOptions = left.options ?? [];
    const rightOptions = right.options ?? [];
    return (
        left.asset === right.asset &&
        cropsMatch(left.crop, right.crop) &&
        leftOptions.length === rightOptions.length &&
        leftOptions.every((option, index) => option === rightOptions[index])
    );
}

function copyArtUpdate(art: ArtUpdate): ArtUpdate {
    return {
        asset: art.asset,
        crop: copyCrop(art.crop),
        ...(art.options ? { options: [...art.options] } : {}),
    };
}

export const useCatalogStore = defineStore("catalog", () => {
    const config = ref<EditorConfig | undefined>(
        window.__COMIC_LABELS_CONFIG__
            ? cloneConfig(window.__COMIC_LABELS_CONFIG__)
            : undefined,
    );
    const view = ref<ViewMode>("editor");
    const categoryFilter = ref("all");
    const savedArts = ref<Record<string, ArtUpdate>>(
        config.value ? artsForConfig(config.value) : {},
    );
    const pendingArts = ref<Record<string, ArtUpdate>>({});
    const sessionCrops = ref<Record<string, CropUpdate>>({});
    const activeDesignVariant = ref<DesignVariant>("A");
    const pendingLayouts = ref<Record<DesignVariant, LayoutUpdate>>({
        A: {},
        B: {},
    });
    const saveState = ref<SaveState>("idle");
    const saveMessage = ref("");
    const artworkErrors = ref<Record<string, string>>({});

    const labels = computed(() => config.value?.labels ?? []);
    const filteredLabels = computed(() =>
        categoryFilter.value === "all"
            ? labels.value
            : labels.value.filter(
                  label => label.category === categoryFilter.value,
              ),
    );
    const layout = computed(() =>
        config.value
            ? layoutForVariant(config.value.layout, activeDesignVariant.value)
            : undefined,
    );
    const isSaveAvailable = computed(() => isLiveEditor());
    const isSaving = computed(() => saveState.value === "saving");
    const pendingChangeCount = computed(
        () =>
            Object.keys(pendingArts.value).length +
            Object.keys(pendingLayouts.value[activeDesignVariant.value]).length,
    );
    const hasPendingChanges = computed(() => pendingChangeCount.value > 0);

    function setConfig(nextConfig: EditorConfig): void {
        config.value = cloneConfig(nextConfig);
        savedArts.value = artsForConfig(config.value);
        pendingArts.value = {};
        sessionCrops.value = {};
        pendingLayouts.value = { A: {}, B: {} };
        artworkErrors.value = {};
    }

    async function refreshFromServer(): Promise<void> {
        const liveConfig = await requestLiveConfig();
        if (liveConfig) setConfig(liveConfig);
    }

    function labelForId(id: string): LabelConfig {
        const label = config.value?.labels.find(
            candidate => candidate.id === id,
        );
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
        if (!candidates.includes(asset))
            throw new Error(`Unknown artwork option for ${id}`);

        const currentCrop = copyCrop(label.art.crop);
        const nextCrop = sessionCrops.value[`${id}\u0000${asset}`] ?? {
            focus: { x: 0.5, y: 0.5 },
            scale: 1,
        };
        sessionCrops.value = {
            ...sessionCrops.value,
            [`${id}\u0000${label.art.asset}`]: currentCrop,
        };
        label.art.asset = asset;
        updateCrop(id, nextCrop);
    }

    function addArtworkUrl(id: string, value: string): string | undefined {
        let asset: string;
        try {
            asset = normalizeManualArtworkUrl(value);
        } catch (error) {
            return error instanceof Error ? error.message : "Invalid cover URL.";
        }
        const label = labelForId(id);
        const configuredOptions = label.art.options ?? [];
        const options = configuredOptions.includes(label.art.asset)
            ? configuredOptions
            : [label.art.asset, ...configuredOptions];
        if (options.includes(asset)) return "This cover URL is already listed.";

        label.art.options = [...options, asset];
        if (asset === label.art.asset) updateCrop(id, label.art.crop);
        else selectArtwork(id, asset);
        return undefined;
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
        return savedArt
            ? artsMatch(artForLabel(labelForId(id)), savedArt)
            : true;
    }

    function artworkUrl(asset: string): string {
        return config.value?.artworkUrls[asset] ?? asset;
    }

    function reportArtworkError(id: string, asset: string): void {
        artworkErrors.value = {
            ...artworkErrors.value,
            [`${id}\u0000${asset}`]:
                "This cover could not be loaded. Try another image URL.",
        };
    }

    function clearArtworkError(id: string, asset: string): void {
        const key = `${id}\u0000${asset}`;
        if (!artworkErrors.value[key]) return;
        const { [key]: _cleared, ...remainingErrors } = artworkErrors.value;
        artworkErrors.value = remainingErrors;
    }

    function artworkError(id: string): string | undefined {
        return artworkErrors.value[`${id}\u0000${labelForId(id).art.asset}`];
    }

    function updateLayout(update: LayoutUpdate): void {
        if (!config.value) return;
        const layout = config.value.layout.designVariants[activeDesignVariant.value];
        if (update.artTreatment)
            layout.artTreatment = { ...update.artTreatment };
        if (update.identityBandHeightInches !== undefined) {
            layout.identityBand.heightInches = update.identityBandHeightInches;
        }
        if (update.metadataBandHeightInches !== undefined) {
            layout.metadataBand.heightInches = update.metadataBandHeightInches;
        }
        if (update.typography) layout.typography = { ...update.typography };
        if (update.logoPalette) layout.logoPalette = { ...update.logoPalette };
        if (update.logoOutline) layout.logoOutline = { ...update.logoOutline };
        pendingLayouts.value = {
            ...pendingLayouts.value,
            [activeDesignVariant.value]: {
                ...pendingLayouts.value[activeDesignVariant.value],
                ...structuredClone(update),
            },
        };
        saveState.value = "idle";
    }

    function selectDesignVariant(variant: DesignVariant): void {
        activeDesignVariant.value = variant;
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
            layout: {
                variant: activeDesignVariant.value,
                changes: pendingLayouts.value[activeDesignVariant.value],
            },
        };
        if (Object.keys(updates.arts ?? {}).length === 0) delete updates.arts;
        if (Object.keys(pendingLayouts.value[activeDesignVariant.value]).length === 0)
            delete updates.layout;

        saveState.value = "saving";
        try {
            const response = await fetch("/api/edits", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            const result = (await response.json()) as {
                error?: string;
                saved?: { arts: number; layout: number };
            };
            if (!response.ok)
                throw new Error(
                    result.error ?? "Unable to save configuration changes.",
                );

            const savedCount =
                (result.saved?.arts ?? 0) + (result.saved?.layout ?? 0);
            if (updates.arts) {
                savedArts.value = {
                    ...savedArts.value,
                    ...Object.fromEntries(
                        Object.entries(updates.arts).map(([id, art]) => [
                            id,
                            copyArtUpdate(art),
                        ]),
                    ),
                };
            }
            pendingArts.value = {};
            pendingLayouts.value = {
                ...pendingLayouts.value,
                [activeDesignVariant.value]: {},
            };
            saveState.value = "saved";
            saveMessage.value = `Saved ${savedCount} change${savedCount === 1 ? "" : "s"} to configuration.`;
        } catch (error) {
            saveState.value = "error";
            const message =
                error instanceof Error ? error.message : "Unknown error";
            saveMessage.value = `Save failed: ${message}`;
        }
    }

    async function saveArtwork(id: string): Promise<void> {
        const art = pendingArts.value[id];
        if (!art || !isSaveAvailable.value || isSaving.value) return;

        const update = copyArtUpdate(art);
        saveState.value = "saving";
        try {
            const response = await fetch("/api/edits", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    arts: { [id]: update },
                } satisfies EditorUpdates),
            });
            const result = (await response.json()) as {
                error?: string;
                saved?: { arts: number; layout: number };
            };
            if (!response.ok)
                throw new Error(
                    result.error ?? "Unable to save artwork changes.",
                );

            savedArts.value = {
                ...savedArts.value,
                [id]: copyArtUpdate(update),
            };
            if (artsMatch(artForLabel(labelForId(id)), update)) {
                const { [id]: _saved, ...remainingArts } = pendingArts.value;
                pendingArts.value = remainingArts;
            }
            saveState.value = "saved";
            saveMessage.value = `Saved cover and crop for ${id}.`;
        } catch (error) {
            saveState.value = "error";
            const message =
                error instanceof Error ? error.message : "Unknown error";
            saveMessage.value = `Save failed: ${message}`;
        }
    }

    return {
        config,
        labels,
        filteredLabels,
        layout,
        activeDesignVariant,
        view,
        categoryFilter,
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
        addArtworkUrl,
        revertCrop,
        isCropSaved,
        artworkUrl,
        reportArtworkError,
        clearArtworkError,
        artworkError,
        updateLayout,
        selectDesignVariant,
    };
});
