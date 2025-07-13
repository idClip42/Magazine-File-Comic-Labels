import { BoxConfig } from './types';

export function BuildLabelHTML(seriesName: string, bgColor:string, volume: string | undefined, box: BoxConfig): string {
  const title = box.overrideName || seriesName;
  const volumeText = volume ? `<div class="volume">${volume}</div>` : '';
  const issues = box.issues;

  return `
    <div class="label" style="background-color: ${bgColor};">
      <div class="label-content">
        <div class="title">${title}</div>
        ${volumeText}
        <div class="issues">${issues}</div>
      </div>
      <img src="${box.coverArt}" class="label-image">
    </div>
  `;
}
