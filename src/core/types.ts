export type Range = [number, number];

export type ArtCrop = {
    focus: { x: number; y: number };
    scale: number;
};

export type LabelContent = {
    name?: string;
    volume?: number;
    issues?: Range;
    years?: Range;
};

export type CategoryLogo = {
    asset: string;
    maxWidthPercent?: number;
};

export type Category = {
    name: string;
    color: string;
    logos: Record<string, CategoryLogo>;
    artTreatment?: Partial<ArtTreatment>;
};

export type CategoriesConfig = Record<string, Category>;

/** UI-managed artwork state for one physical label. */
export type LabelArtConfig = {
    asset: string;
    /** Optional, ordered alternatives shown only in the local crop editor. */
    options?: string[];
    crop: ArtCrop;
};

/** The manually maintained, print-ordered facts for one physical label. */
export type LabelEditorialConfig = {
    id: string;
    category: string;
    logo: string;
    contents: LabelContent[];
};

/** Artwork state keyed by its matching editorial label ID. */
export type LabelArtConfigById = Record<string, LabelArtConfig>;

/** The joined configuration consumed by rendering, editing, and asset tools. */
export type LabelConfig = LabelEditorialConfig & { art: LabelArtConfig };

export type LayoutConfig = {
    localAssetRoot: string;
    face: { widthInches: number; heightInches: number };
    /** Physical material that wraps around the left and right file edges. */
    overwrapInches: number;
    topRuleHeightInches: number;
    artTreatment: ArtTreatment;
    identityBand: { bottomInches: number; heightInches: number };
    fingerHole: {
        diameterInches: number;
        topInches: number;
        guideScale: number;
    };
    metadataBand: { topInches: number; heightInches: number };
    typography: {
        yearsSizeInches: number;
        metadataSizeInches: number;
        bandGapInches: number;
    };
    years: {
        display: "condensed-range" | "separate-ranges";
        reserveSpaceWhenEmpty: boolean;
    };
    logoPalette: {
        mutedSaturationMultiplier: number;
    };
    logoOutline: {
        enabled: boolean;
        color: string;
        widthPixels: number;
        lineJoin: "round" | "miter" | "bevel";
    };
    showCutGuide: boolean;
};

export type ArtTreatment = {
    saturation: number;
    contrast: number;
    brightness: number;
    tintOpacity: number;
    tintBlendMode: "color" | "multiply" | "overlay" | "soft-light";
};

/** The complete configuration snapshot the Vue editor receives from the build or local server. */
export type EditorConfig = {
    layout: LayoutConfig;
    categories: CategoriesConfig;
    labels: LabelConfig[];
    preparedLogos: Record<string, string>;
    /** Maps each configured artwork asset to the browser URL that serves it. */
    artworkUrls: Record<string, string>;
};
