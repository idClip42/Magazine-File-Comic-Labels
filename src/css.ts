import { Config } from "./config";
const DIM = Config.format.dimensions;

export const CSS_TEXT = `
    <style>
      @page{
        size: ${DIM.pageSizeXInches}in ${DIM.pageSizeYInches}in;
        margin: ${DIM.pageMarginYInches}in ${DIM.pageMarginXInches}in;
      }

      body {
        font-family: futura;
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
        opacity: 100%;
        z-index: 10;
        display: block;
      }

      .label-fade-block {
        height: 0.5in;
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: white;
        display: block;
        -webkit-mask-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,0)), to(rgba(0,0,0,1)));
      }

      .label-content-content {
        padding: 0.1in;
        background-color: white;
        min-height: ${DIM.textboxMinHeightInches}in;
      }

      .title {
        font-size: 1.2em;
        font-weight: bold;
        margin: auto;
      }

      .title-logo {
        width: 100%;
        background-color: white;
        mix-blend-mode: luminosity;
        display: block;
      }

      .label-text {
        margin: 0.25in;
      }

      .subseries-name {
        font-weight: bold;
        font-size: 1.2em;
      }

      .volume {
        font-size: .8em;
        font-style: italic;
        margin: 0.1em 0;
      }

      .issues {
        font-size: 1em;
        margin-top: 0.2em;
        white-space: nowrap;
      }

      .years {
        font-size: .8em;
        font-style: italic;
      }
    </style>
`;