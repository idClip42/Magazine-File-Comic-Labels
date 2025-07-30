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
  subseriesName?: string;
  volume?: number;
  issues?: { start: number; end: number; };
  years?: { start: number, end: number; };
  coverArt: string; // Can be local path or full URL
  scale?: number;
  offsetX?: number;
}

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
