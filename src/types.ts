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
  issues: { start: number; end: number; };
  coverArt: string; // Can be local path or full URL
  scale?: number;
  offsetX?: number;
}

export type SeriesConfig = {
  name: string;
  color: string; // Hex or named CSS color
  volume?: number;
  boxes: BoxConfig[];
}

export type LabelConfig = {
  format: FormatConfig;
  series: SeriesConfig[];
}
