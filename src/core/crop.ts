/**
 * A crop scale of one is the image's base `cover` fit: the smallest rendered
 * size that can fill the complete label.  The upper limit is deliberately
 * generous for panel details while still preventing accidental extreme zoom.
 */
export const CROP_SCALE_MIN = 1;
export const CROP_SCALE_MAX = 10;

export function clamp(value: number, minimum: number, maximum: number): number {
    return Math.min(maximum, Math.max(minimum, value));
}

/** Keep persisted crop values readable without losing useful drag precision. */
export function roundCropValue(value: number, precision: number): number {
    const multiplier = 10 ** precision;
    return Math.round(value * multiplier) / multiplier;
}
