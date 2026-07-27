export type Range = [number, number];

export type LegacyCrop = {
  topInches?: number;
  leftInches?: number;
  zoom?: number;
};

export type ArtCrop = {
  focus: { x: number; y: number };
  scale: number;
  legacy?: LegacyCrop;
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
    crop: ArtCrop;
  };
  contents: LabelContent[];
};

export type LayoutConfig = {
  localAssetRoot: string;
  face: { widthInches: number; heightInches: number };
  overwrapInches: number;
  topRuleHeightInches: number;
  artTreatment: ArtTreatment;
  identityBand: { topInches: number; heightInches: number };
  fingerHole: { diameterInches: number; topInches: number; guideScale: number };
  metadataBand: { topInches: number; heightInches: number };
  typography: {
    yearsSizeInches: number;
    metadataSizeInches: number;
    bandGapInches: number;
  };
  years: {
    display: "condensed-range" | "separate-ranges";
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
