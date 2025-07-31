import { BoxConfig, SeriesConfig } from './types';

export function BuildLabelHTML(series:SeriesConfig, box: BoxConfig): string {
  // const title = series.name;
  const title = series.logo ? `<img src="${series.logo}" class="title-logo">` : series.name;
  const titleStyle = series.logo ? `background-color: ${series.color}; width: 50%;` : '';

  const imgStyle = (()=>{
    if(!box.coverArtTransform)
      return "";
    let style = "";

    if(box.coverArtTransform.top !== undefined)
      style += `top: ${box.coverArtTransform.top}in; `
    if(box.coverArtTransform.left !== undefined)
      style += `left: ${box.coverArtTransform.left}in; `
    if(box.coverArtTransform.zoom !== undefined)
      style += `height: ${100 * box.coverArtTransform.zoom}%`

    return style;
  })();

  const subseriesHtmlBlocks = box.subseries.map(subseries => {
    const subseriesTitle = subseries.name ? `<span class="subseries-name">${subseries.name}</span>` : '';
    const volumeText = subseries.volume ? `<span class="volume">(Vol. ${subseries.volume})</span>` : '';
    const issues = (()=>{
      if(!subseries.issues) return "";
      const text = (subseries.issues.start === subseries.issues.end) ?
        subseries.issues.start :
        `${subseries.issues.start} - ${subseries.issues.end}`;
      return `<span class="issues">#${text}</span>`;
    })();
    const years = (()=>{
      if(!subseries.years) return "";
      const text = (subseries.years.start === subseries.years.end) ?
        subseries.years.start :
        `${subseries.years.start} - ${subseries.years.end}`;
      return `<span class="years">${text}</span>`;
    })();
    return `
            <div>
              <div>
                ${subseriesTitle}
                ${volumeText}
                ${issues}
              </div>
              <div>
                ${years}
              </div>
            </div>
    `.trim();
  });

  return `
    <div class="label" style="background-color: ${series.color};">
      <img src="${box.coverArt}" class="label-image" style="${imgStyle}">
      <div class="label-content">
        <div class="label-fade-block"></div>
        <div class="label-content-content">
          <div class="title" style="${titleStyle}">
            ${title}
          </div>
          <div class="label-text">
            ${subseriesHtmlBlocks.join("\n")}
          </div>
        </div>
      </div>
    </div>
  `;
}
