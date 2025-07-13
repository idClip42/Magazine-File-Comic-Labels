import CONFIG from "./../config.json";
const DIM = CONFIG.format.dimensions;

export const CSS_TEXT = `
    <style>
      body {
        font-family: sans-serif;
        padding: ${DIM.pagePaddingInches}in;
        background: #f5f5f5;
      }
      .label {
        width: ${DIM.labelWidthInches}in;
        height: ${DIM.labelHeightInches}in;
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 0 0.1in rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1in;
      }
    </style>
  `;