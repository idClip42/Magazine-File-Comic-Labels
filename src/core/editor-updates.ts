import type {
    ArtCrop,
    ArtTreatment,
    LayoutConfig,
} from "./types";

export type CropUpdate = Pick<ArtCrop, "focus" | "scale">;

export type ArtUpdate = {
    asset: string;
    crop: CropUpdate;
    /** Present only when the editor has appended artwork candidates. */
    options?: string[];
};

/** The deliberately limited shared-layout settings editable from the browser. */
export type LayoutUpdate = {
    artTreatment?: ArtTreatment;
    identityBandHeightInches?: number;
    metadataBandHeightInches?: number;
    typography?: LayoutConfig["typography"];
    logoPalette?: LayoutConfig["logoPalette"];
    logoOutline?: LayoutConfig["logoOutline"];
};

export type EditorUpdates = {
    arts?: Record<string, ArtUpdate>;
    layout?: LayoutUpdate;
};
