export type DimensionsConfig = {
  labelWidthInches: number;
  labelHeightInches: number;
  textboxMinHeightInches: number;
  pageSizeXInches: number,
  pageSizeYInches: number
  pageMarginXInches: number,
  pageMarginYInches: number
}

export type FormatConfig = {
  dimensions: DimensionsConfig;
}

export type BoxConfig = {
  subseries: SubseriesInfo[];
  coverArt: string; // Can be local path or full URL
  coverArtTransform?: {
    top?: number;
    left?: number;
    zoom?: number;
  };
}

export type SubseriesInfo = {
  name?: string;
  volume?: number;
  issues?: { start: number; end: number; };
  years?: { start: number, end: number; };
};

export type SeriesConfig = {
  name: string;
  logo?: string;
  color: string; // Hex or named CSS color
  boxes: BoxConfig[];
}

export type LabelConfig = {
  format: FormatConfig;
  series: SeriesConfig[];
}
