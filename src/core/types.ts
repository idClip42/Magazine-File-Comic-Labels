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

export type LabelConfig = {
    id: string;
    category: string;
    logo: string;
    art: {
        asset: string;
        /** Optional, ordered alternatives shown only in the local crop editor. */
        options?: string[];
        crop: ArtCrop;
    };
    contents: LabelContent[];
};

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
    /** Two independently editable presentations of the shared label design. */
    designVariants: Record<DesignVariant, LayoutDesign>;
};

export type DesignVariant = "A" | "B";

/** The global presentation settings that can be compared without duplicating the catalog. */
export type LayoutDesign = Pick<
    LayoutConfig,
    | "artTreatment"
    | "identityBand"
    | "metadataBand"
    | "typography"
    | "years"
    | "logoPalette"
    | "logoOutline"
    | "showCutGuide"
>;

/** Resolves one test variant onto the fixed physical layout. */
export function layoutForVariant(
    layout: LayoutConfig,
    variant: DesignVariant,
): LayoutConfig {
    // The editor passes Vue-reactive objects here. Do not structured-clone the
    // selected design: browser structuredClone rejects Vue proxies and would
    // leave label components without a resolved physical layout.
    const design = layout.designVariants?.[variant];
    if (!design) return layout;
    return {
        ...layout,
        ...design,
        designVariants: layout.designVariants,
    };
}

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
