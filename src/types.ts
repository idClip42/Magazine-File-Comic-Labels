export type DimensionsConfig = {
  labelWidthInches: number;
  labelHeightInches: number;
  pagePaddingInches: number;
  textboxMinHeightInches: number;
}

export type FormatConfig = {
  dimensions: DimensionsConfig;
}

export type BoxConfig = {
  subseriesName?: string;
  issues: string;
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
