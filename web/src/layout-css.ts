import type { LayoutConfig } from "../../src/types";

/** CSS variables that change while previewing the identity-band height. */
export function identityBandCssVariables(
    layout: LayoutConfig,
    heightInches = layout.identityBand.heightInches,
): Record<string, string> {
    const identityTop = layout.overwrapInches
        + layout.identityBand.bottomInches
        - heightInches;

    return {
        "--identity-top": `${identityTop}in`,
        "--identity-height": `${heightInches}in`,
    };
}

/** Produces the physical layout variables consumed by the print CSS. */
export function layoutCssVariables(layout: LayoutConfig): Record<string, string> {
    const totalWidth = layout.face.widthInches + layout.overwrapInches * 2;
    const totalHeight = layout.face.heightInches + layout.overwrapInches * 2;
    const metadataTop = layout.overwrapInches + layout.metadataBand.topInches;
    const holeHeight = layout.fingerHole.diameterInches / 2;
    const guideWidth = layout.fingerHole.diameterInches * layout.fingerHole.guideScale;
    const guideHeight = holeHeight * layout.fingerHole.guideScale;
    const holeTop = layout.overwrapInches
        + layout.fingerHole.topInches
        + (holeHeight - guideHeight) / 2;

    return {
        "--face-width": `${layout.face.widthInches}in`,
        "--face-height": `${layout.face.heightInches}in`,
        "--overwrap": `${layout.overwrapInches}in`,
        "--total-width": `${totalWidth}in`,
        "--total-height": `${totalHeight}in`,
        "--top-rule-height": `${layout.topRuleHeightInches}in`,
        ...identityBandCssVariables(layout),
        "--metadata-top": `${metadataTop}in`,
        "--metadata-height": `${layout.metadataBand.heightInches}in`,
        "--hole-width": `${guideWidth}in`,
        "--hole-height": `${guideHeight}in`,
        "--hole-top": `${holeTop}in`,
        "--years-size": `${layout.typography.yearsSizeInches}in`,
        "--metadata-size": `${layout.typography.metadataSizeInches}in`,
        "--band-gap": `${layout.typography.bandGapInches}in`,
        "--logo-outline-color": layout.logoOutline.color,
        "--logo-outline-width": layout.logoOutline.enabled
            ? `${layout.logoOutline.widthPixels}px`
            : "0",
        "--logo-outline-linejoin": layout.logoOutline.lineJoin,
        "--cut-guide-display": layout.showCutGuide ? "block" : "none",
    };
}
