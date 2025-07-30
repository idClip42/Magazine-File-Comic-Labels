import { BoxConfig, SeriesConfig } from './types';

export function BuildLabelHTML(series:SeriesConfig, box: BoxConfig): string {
  // const title = series.name;
  const title = series.logo ? `<img src="${series.logo}" class="title-logo">` : series.name;
  const titleStyle = series.logo ? `background-color: ${series.color}; width: 50%;` : '';

  const subseriesHtmlBlocks = box.subseries.map(subseries => {
    const subseriesTitle = subseries.name ? `<span class="subseries-name">${subseries.name}</span>` : '';
    const volumeText = subseries.volume ? `<span class="volume">(Vol. ${subseries.volume})</span>` : '';
    const issues = subseries.issues ? `<div class="issues">#${subseries.issues.start} - ${subseries.issues.end}</div>` : "";
    const years = (()=>{
      if(!subseries.years) return "";
      const text = (subseries.years.start === subseries.years.end) ?
        subseries.years.start :
        `${subseries.years.start} - ${subseries.years.end}`;
      return `<div class="years">${text}</div>`;
    })();
    return `
          <div>
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
    `.trim();
  });

  return `
    <div class="label" style="background-color: ${series.color};">
      <img src="${box.coverArt}" class="label-image">
      <div class="label-content">
        <div class="label-fade-block"></div>
        <div class="label-content-content">
          ${subseriesHtmlBlocks.join("\n")}
        </div>
      </div>
    </div>
  `;
}
