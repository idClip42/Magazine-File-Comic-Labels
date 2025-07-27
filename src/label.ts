import { BoxConfig, SeriesConfig } from './types';

export function BuildLabelHTML(series:SeriesConfig, box: BoxConfig): string {
  // const title = series.name;
  const title = series.logo ? `<img src="${series.logo}" class="title-logo">` : series.name;
  const titleStyle = series.logo ? `background-color: ${series.color}; width: 50%;` : '';
  const subseriesTitle = box.subseriesName ? `<span class="subseries-name">${box.subseriesName}</span>` : '';
  const volumeText = series.volume ? `<span class="volume">(Vol. ${series.volume})</span>` : '';
  const issues = box.issues ? `<div class="issues">${box.issues.start}-${box.issues.end}</div>` : "";
  const years = (()=>{
    if(!box.years) return "";
    const text = (box.years.start === box.years.end) ?
      box.years.start :
      `${box.years.start} - ${box.years.end}`;
    return `<div class="years">${text}</div>`;
  })();

  return `
    <div class="label" style="background-color: ${series.color};">
      <img src="${box.coverArt}" class="label-image">
      <div class="label-content">
        <div class="label-fade-block"></div>
        <div class="label-content-content">
          <div class="title" style="${titleStyle}">
            ${title}
          </div>
          <div class="label-text">
            <div>
              ${subseriesTitle}
              ${volumeText}
            </div>
            <div>
              ${issues}
            </div>
            <div>
              ${years}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
