import { BoxConfig, SeriesConfig } from './types';

export function BuildLabelHTML(series:SeriesConfig, box: BoxConfig): string {
  const title = box.overrideName || series.name;
  const volumeText = series.volume ? `<div class="volume">${series.volume}</div>` : '';
  const issues = box.issues;

  return `
    <div class="label" style="background-color: ${series.color};">
      <div class="label-content">
        <div class="title">${title}</div>
        ${volumeText}
        <div class="issues">${issues}</div>
      </div>
      <img src="${box.coverArt}" class="label-image">
    </div>
  `;
}
