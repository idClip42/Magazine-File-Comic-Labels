import CONFIG from "./../config.json";
const DIM = CONFIG.format.dimensions;

export const CSS_TEXT = `
    <style>
      body {
        font-family: sans-serif;
        padding: ${DIM.pagePaddingInches}in;
        background: #f5f5f5;
        display: flex;
        flex-wrap: wrap;
        gap: 0.25in;
      }

      .label {
        width: ${DIM.labelWidthInches}in;
        height: ${DIM.labelHeightInches}in;
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 0 0.1in rgba(0,0,0,0.2);
        page-break-inside: avoid;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding: 0.5in 0.25in;
        box-sizing: border-box;
      }

      .label-content {
        text-align: center;
        width: 100%;
      }

      .title {
        font-size: 1.2em;
        font-weight: bold;
      }

      .volume {
        font-size: 1em;
        margin: 0.1em 0;
      }

      .issues {
        font-size: 1em;
        margin-top: 0.2em;
      }
    </style>
`;