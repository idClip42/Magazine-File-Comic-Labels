export type DimensionsConfig = {
  labelWidthInches: number;
  labelHeightInches: number;
  pagePaddingInches: number;
  fadeHeightInches: number;
}

export type FormatConfig = {
  dimensions: DimensionsConfig;
}

export type BoxConfig = {
  overrideName?: string;
  issues: string;
  coverArt: string; // Can be local path or full URL
  scale?: number;
  offsetX?: number;
}

export type SeriesConfig = {
  color: string; // Hex or named CSS color
  volume?: string;
  boxes: BoxConfig[];
}

export type LabelConfig = {
  format: FormatConfig;
  series: {
    [seriesName: string]: SeriesConfig;
  };
}
