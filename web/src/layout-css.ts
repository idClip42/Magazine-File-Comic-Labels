import type { LayoutConfig } from "../../src/types";

/** Produces the physical layout variables consumed by the print CSS. */
export function layoutCssVariables(layout: LayoutConfig): Record<string, string> {
    const totalWidth = layout.face.widthInches + layout.overwrapInches * 2;
    // The vinyl wraps around the left and right edges only. Its height is the
    // file-face height; adding vertical overwrap would make it impossible to
    // apply as one continuous label.
    const totalHeight = layout.face.heightInches;
    const identityTop = layout.identityBand.bottomInches
        - layout.identityBand.heightInches;
    const metadataTop = layout.metadataBand.topInches;
    const holeHeight = layout.fingerHole.diameterInches / 2;
    const guideWidth = layout.fingerHole.diameterInches * layout.fingerHole.guideScale;
    const guideHeight = holeHeight * layout.fingerHole.guideScale;
    const holeTop = layout.fingerHole.topInches
        + (holeHeight - guideHeight) / 2;

    return {
        "--face-width": `${layout.face.widthInches}in`,
        "--face-height": `${layout.face.heightInches}in`,
        "--overwrap": `${layout.overwrapInches}in`,
        "--total-width": `${totalWidth}in`,
        "--total-height": `${totalHeight}in`,
        "--top-rule-height": `${layout.topRuleHeightInches}in`,
        "--identity-top": `${identityTop}in`,
        "--identity-height": `${layout.identityBand.heightInches}in`,
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
