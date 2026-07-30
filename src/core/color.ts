type Rgb = { red: number; green: number; blue: number };

function parseHexColor(color: string): Rgb {
    const normalized = color.trim().replace(/^#/, "");
    const expanded =
        normalized.length === 3
            ? normalized
                  .split("")
                  .map(part => part + part)
                  .join("")
            : normalized;

    if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
        throw new Error(
            `Category colors must currently be six-digit hex values. Received: ${color}`,
        );
    }

    return {
        red: Number.parseInt(expanded.slice(0, 2), 16),
        green: Number.parseInt(expanded.slice(2, 4), 16),
        blue: Number.parseInt(expanded.slice(4, 6), 16),
    };
}

function rgbToHsl({ red, green, blue }: Rgb): {
    hue: number;
    saturation: number;
    lightness: number;
} {
    const r = red / 255;
    const g = green / 255;
    const b = blue / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lightness = (max + min) / 2;
    const delta = max - min;

    if (delta === 0) return { hue: 0, saturation: 0, lightness };

    const saturation = delta / (1 - Math.abs(2 * lightness - 1));
    let hue = 0;
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;

    return { hue: (hue * 60 + 360) % 360, saturation, lightness };
}

function hslToRgb({
    hue,
    saturation,
    lightness,
}: {
    hue: number;
    saturation: number;
    lightness: number;
}): Rgb {
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const secondary = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
    const match = lightness - chroma / 2;
    const [r, g, b] =
        hue < 60
            ? [chroma, secondary, 0]
            : hue < 120
              ? [secondary, chroma, 0]
              : hue < 180
                ? [0, chroma, secondary]
                : hue < 240
                  ? [0, secondary, chroma]
                  : hue < 300
                    ? [secondary, 0, chroma]
                    : [chroma, 0, secondary];

    return {
        red: Math.round((r + match) * 255),
        green: Math.round((g + match) * 255),
        blue: Math.round((b + match) * 255),
    };
}

function rgbToHex({ red, green, blue }: Rgb): string {
    return `#${[red, green, blue].map(value => value.toString(16).padStart(2, "0")).join("")}`;
}

export function deriveMutedCategoryColor(
    categoryColor: string,
    saturationMultiplier: number,
): string {
    if (saturationMultiplier < 0 || saturationMultiplier > 1) {
        throw new Error(
            `Muted saturation multiplier must be between 0 and 1. Received: ${saturationMultiplier}`,
        );
    }

    const hsl = rgbToHsl(parseHexColor(categoryColor));
    return rgbToHex(
        hslToRgb({ ...hsl, saturation: hsl.saturation * saturationMultiplier }),
    );
}
