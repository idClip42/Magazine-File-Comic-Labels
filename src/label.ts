import { BoxConfig, SeriesConfig } from './types';

export function BuildLabelHTML(series:SeriesConfig, box: BoxConfig): string {
  const title = series.name;
  const subseriesTitle = box.subseriesName ? `<span class="subseries-name">${box.subseriesName}</span>` : '';
  const volumeText = series.volume ? `<span class="volume">(Vol. ${series.volume})</span>` : '';
  const issues = `<div class="issues">${box.issues.start}-${box.issues.end}</div>`;

  return `
    <div class="label" style="background-color: ${series.color};">
      <img src="${box.coverArt}" class="label-image">
      <div class="label-content">
        <div class="title">${title}</div>
        <div>
          ${subseriesTitle}
          ${volumeText}
        </div>
        ${issues}
      </div>
    </div>
  `;
}
