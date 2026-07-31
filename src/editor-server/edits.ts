import { normalizeManualArtworkUrl } from "../core/assets";
import { writeCatalogJson } from "../core/catalog-json";
import { configPaths, labels, layout } from "../core/config";
import { CROP_SCALE_MAX, CROP_SCALE_MIN } from "../core/crop";
import { maximumMetadataBandHeight } from "../core/layout";
import type {
    ArtUpdate,
    CropUpdate,
    EditorUpdates,
    LayoutUpdate,
} from "../core/editor-updates";
import type { ArtTreatment, LayoutConfig } from "../core/types";

const labelsPath = configPaths.labels;
const layoutPath = configPaths.layout;
const labelById = new Map(labels.map(label => [label.id, label]));

function isCropUpdate(value: unknown): value is CropUpdate {
    if (!value || typeof value !== "object") return false;
    const crop = value as CropUpdate;
    return (
        Number.isFinite(crop.focus?.x) &&
        Number.isFinite(crop.focus?.y) &&
        Number.isFinite(crop.scale) &&
        crop.focus.x >= 0 &&
        crop.focus.x <= 1 &&
        crop.focus.y >= 0 &&
        crop.focus.y <= 1 &&
        crop.scale >= CROP_SCALE_MIN &&
        crop.scale <= CROP_SCALE_MAX
    );
}

function isArtUpdate(value: unknown): value is ArtUpdate {
    return (
        !!value &&
        typeof value === "object" &&
        typeof (value as ArtUpdate).asset === "string" &&
        isCropUpdate((value as ArtUpdate).crop) &&
        ((value as ArtUpdate).options === undefined ||
            (Array.isArray((value as ArtUpdate).options) &&
                (value as ArtUpdate).options!.every(
                    option => typeof option === "string" && option.length > 0,
                )))
    );
}

function normalizeArtworkUpdate(
    art: ArtUpdate,
    existingOptions: string[],
    currentAsset: string,
): ArtUpdate {
    if (!art.options) return art;
    const options = art.options.map((option, index) =>
        index < existingOptions.length
            || option === currentAsset
            ? option
            : normalizeManualArtworkUrl(option),
    );
    const selectedIndex = art.options.indexOf(art.asset);
    return {
        ...art,
        asset:
            selectedIndex >= existingOptions.length
                ? options[selectedIndex]
                : art.asset,
        options,
    };
}

function isIdentityBandHeight(value: unknown): value is number {
    return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0.5 &&
        value <= 3.5
    );
}

function isMetadataBandHeight(value: unknown): value is number {
    return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0.5 &&
        value <= maximumMetadataBandHeight(layout)
    );
}

function isArtTreatment(value: unknown): value is ArtTreatment {
    if (!value || typeof value !== "object") return false;
    const treatment = value as ArtTreatment;
    return (
        Number.isFinite(treatment.saturation) &&
        treatment.saturation >= 0 &&
        treatment.saturation <= 1 &&
        Number.isFinite(treatment.contrast) &&
        treatment.contrast >= 0.5 &&
        treatment.contrast <= 1.5 &&
        Number.isFinite(treatment.brightness) &&
        treatment.brightness >= 0.5 &&
        treatment.brightness <= 1.5 &&
        Number.isFinite(treatment.tintOpacity) &&
        treatment.tintOpacity >= 0 &&
        treatment.tintOpacity <= 1 &&
        ["color", "multiply", "overlay", "soft-light"].includes(
            treatment.tintBlendMode,
        )
    );
}

function isTypography(value: unknown): value is LayoutConfig["typography"] {
    if (!value || typeof value !== "object") return false;
    const typography = value as LayoutConfig["typography"];
    return (
        Number.isFinite(typography.yearsSizeInches) &&
        typography.yearsSizeInches >= 0.15 &&
        typography.yearsSizeInches <= 0.5 &&
        Number.isFinite(typography.metadataSizeInches) &&
        typography.metadataSizeInches >= 0.08 &&
        typography.metadataSizeInches <= 0.25 &&
        Number.isFinite(typography.bandGapInches) &&
        typography.bandGapInches >= 0 &&
        typography.bandGapInches <= 0.15
    );
}

function isLogoPalette(value: unknown): value is LayoutConfig["logoPalette"] {
    return (
        !!value &&
        typeof value === "object" &&
        Number.isFinite(
            (value as LayoutConfig["logoPalette"]).mutedSaturationMultiplier,
        ) &&
        (value as LayoutConfig["logoPalette"]).mutedSaturationMultiplier >= 0 &&
        (value as LayoutConfig["logoPalette"]).mutedSaturationMultiplier <= 1
    );
}

function isLogoOutline(value: unknown): value is LayoutConfig["logoOutline"] {
    if (!value || typeof value !== "object") return false;
    const outline = value as LayoutConfig["logoOutline"];
    return (
        typeof outline.enabled === "boolean" &&
        /^#[0-9a-f]{6}$/i.test(outline.color) &&
        Number.isInteger(outline.widthPixels) &&
        outline.widthPixels >= 0 &&
        outline.widthPixels <= 6 &&
        ["round", "miter", "bevel"].includes(outline.lineJoin)
    );
}

function validateLayoutUpdate(update: LayoutUpdate): void {
    if (!update || typeof update !== "object" || Array.isArray(update)) {
        throw new Error("Expected layout changes to be an object.");
    }
    const allowedFields = new Set([
        "artTreatment",
        "identityBandHeightInches",
        "metadataBandHeightInches",
        "typography",
        "logoPalette",
        "logoOutline",
    ]);
    if (Object.keys(update).some(key => !allowedFields.has(key))) {
        throw new Error("The requested layout setting cannot be edited here.");
    }
    if (Object.keys(update).length === 0) {
        throw new Error("Expected at least one layout change.");
    }
    if (
        update.artTreatment !== undefined &&
        !isArtTreatment(update.artTreatment)
    ) {
        throw new Error(
            "Art-treatment values are outside their allowed ranges.",
        );
    }
    if (
        update.identityBandHeightInches !== undefined &&
        !isIdentityBandHeight(update.identityBandHeightInches)
    ) {
        throw new Error(
            "Identity-band height must be between 0.5 and 3.5 inches.",
        );
    }
    if (
        update.metadataBandHeightInches !== undefined &&
        !isMetadataBandHeight(update.metadataBandHeightInches)
    ) {
        throw new Error(
            `Metadata-band height must be between 0.5 and ${maximumMetadataBandHeight(layout)} inches.`,
        );
    }
    if (update.typography !== undefined && !isTypography(update.typography)) {
        throw new Error("Typography values are outside their allowed ranges.");
    }
    if (
        update.logoPalette !== undefined &&
        !isLogoPalette(update.logoPalette)
    ) {
        throw new Error("Muted-logo saturation must be between 0 and 1.");
    }
    if (
        update.logoOutline !== undefined &&
        !isLogoOutline(update.logoOutline)
    ) {
        throw new Error(
            "Logo-outline values are outside their allowed ranges.",
        );
    }
}

export function assertEditorUpdates(
    value: unknown,
): asserts value is EditorUpdates {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error("Expected editor changes to be an object.");
    }
    const updates = value as EditorUpdates;
    if (
        updates.arts !== undefined &&
        (typeof updates.arts !== "object" || Array.isArray(updates.arts))
    ) {
        throw new Error("Expected artwork changes to be an object.");
    }
    if (
        updates.layout !== undefined &&
        (typeof updates.layout !== "object" || Array.isArray(updates.layout))
    ) {
        throw new Error("Expected layout changes to be an object.");
    }
    if (updates.arts === undefined && updates.layout === undefined) {
        throw new Error("Expected at least one editor change.");
    }
}

export function saveChanges(updates: EditorUpdates): {
    arts: number;
    layout: number;
} {
    assertEditorUpdates(updates);
    const arts = Object.fromEntries(
        Object.entries(updates.arts ?? {}).map(([id, art]) => {
            const label = labelById.get(id);
            return [
                id,
                label
                    ? normalizeArtworkUpdate(
                          art,
                          label.art.options ?? [],
                          label.art.asset,
                      )
                    : art,
            ];
        }),
    );
    const layoutUpdate = updates.layout;
    if (layoutUpdate) validateLayoutUpdate(layoutUpdate);

    for (const [id, art] of Object.entries(arts)) {
        if (!labelById.has(id)) throw new Error(`Unknown label ID: ${id}`);
        if (!isArtUpdate(art))
            throw new Error(`Invalid artwork values for ${id}`);
        const label = labelById.get(id)!;
        const candidates = label.art.options ?? [];
        const updatedCandidates = art.options ?? candidates;
        if (
            art.options !== undefined &&
            (art.options.length < candidates.length ||
                candidates.some(
                    (candidate, index) => art.options![index] !== candidate,
                ))
        ) {
            throw new Error(
                `Artwork options for ${id} may only be appended in their existing order.`,
            );
        }
        if (new Set(updatedCandidates).size !== updatedCandidates.length) {
            throw new Error(`Artwork options for ${id} contain duplicates.`);
        }
        if (
            art.asset !== label.art.asset &&
            !updatedCandidates.includes(art.asset)
        ) {
            throw new Error(`Artwork is not a configured option for ${id}`);
        }
    }

    for (const [id, art] of Object.entries(arts)) {
        const label = labelById.get(id)!;
        label.art.asset = art.asset;
        label.art.crop = {
            ...label.art.crop,
            focus: { x: art.crop.focus.x, y: art.crop.focus.y },
            scale: art.crop.scale,
        };
        if (art.options !== undefined) label.art.options = [...art.options];
    }
    if (Object.keys(arts).length > 0) writeCatalogJson(labelsPath, labels);

    if (layoutUpdate) {
        if (layoutUpdate.artTreatment)
            layout.artTreatment = layoutUpdate.artTreatment;
        if (layoutUpdate.identityBandHeightInches !== undefined) {
            layout.identityBand.heightInches =
                layoutUpdate.identityBandHeightInches;
        }
        if (layoutUpdate.metadataBandHeightInches !== undefined) {
            layout.metadataBand.heightInches =
                layoutUpdate.metadataBandHeightInches;
        }
        if (layoutUpdate.typography)
            layout.typography = layoutUpdate.typography;
        if (layoutUpdate.logoPalette)
            layout.logoPalette = layoutUpdate.logoPalette;
        if (layoutUpdate.logoOutline)
            layout.logoOutline = layoutUpdate.logoOutline;
        writeCatalogJson(layoutPath, layout);
    }

    return {
        arts: Object.keys(arts).length,
        layout: layoutUpdate ? Object.keys(layoutUpdate).length : 0,
    };
}
