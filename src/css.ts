import { Config } from "./config";
const DIM = Config.format.dimensions;

export const CSS_TEXT = `
    <style>
      @page{
        size: ${DIM.pageSizeXInches}in ${DIM.pageSizeYInches}in;
        margin: ${DIM.pageMarginYInches}in ${DIM.pageMarginXInches}in;
      }

      body {
        font-family: sans-serif;
        display: flex;
        flex-wrap: wrap;
        gap: 0;
        column-gap: 0;
        margin: 0;
        padding: 0;
      }

      .label {
        width: ${DIM.labelWidthInches}in;
        height: ${DIM.labelHeightInches}in;
        border: 1px solid #ccc;
        page-break-inside: avoid;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding: 0;
        box-sizing: border-box;
        margin: 0px;
        position: relative;
        overflow: hidden;
      }

      .label-image {
        height: 100%;
        position: absolute;
        opacity: 50%;
        mix-blend-mode: luminosity;
      }

      .label-content {
        text-align: center;
        width: 100%;
        background-color: white;
        box-shadow: 0 -0.25in 0.15in white;
        -moz-box-shadow: 0 -0.25in 0.15in white;
        -webkit-box-shadow: 0 -0.25in 0.15in white;
        padding: 0.5in;
        min-height: ${DIM.textboxMinHeightInches}in;
        opacity: 100%;
        z-index: 10;
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