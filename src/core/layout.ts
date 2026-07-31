import type { LayoutConfig } from "./types";

/** The metadata band may not extend past the physical bottom edge of a label. */
export function maximumMetadataBandHeight(
    layout: Pick<LayoutConfig, "face" | "metadataBand">,
): number {
    return Math.max(
        0,
        layout.face.heightInches - layout.metadataBand.topInches,
    );
}
