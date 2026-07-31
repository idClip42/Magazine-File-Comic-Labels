import { CROP_SCALE_MAX, CROP_SCALE_MIN } from "./crop";
import type { CategoriesConfig, LabelConfig, LayoutConfig } from "./types";

function validRange(value: unknown): value is [number, number] {
    return (
        Array.isArray(value) &&
        value.length === 2 &&
        value.every(
            item => typeof item === "number" && Number.isFinite(item),
        ) &&
        value[0] <= value[1]
    );
}

/**
 * Checks the cross-file invariants TypeScript cannot prove for JSON-loaded
 * configuration. This intentionally does not make editorial choices about
 * labels, contents, or artwork selection.
 */
export function validateCatalog(
    layout: LayoutConfig,
    categories: CategoriesConfig,
    labels: LabelConfig[],
): string[] {
    const errors: string[] = [];
    if (layout.face.widthInches <= 0 || layout.face.heightInches <= 0) {
        errors.push("Layout face dimensions must be greater than zero.");
    }
    if (layout.overwrapInches < 0) {
        errors.push("Layout overwrap cannot be negative.");
    }

    const ids = new Set<string>();
    for (const label of labels) {
        if (!label.id) errors.push("A label is missing its ID.");
        else if (ids.has(label.id))
            errors.push(`Duplicate label ID: ${label.id}.`);
        else ids.add(label.id);

        const category = categories[label.category];
        if (!category) {
            errors.push(`${label.id}: unknown category ${label.category}.`);
        } else if (!category.logos[label.logo]) {
            errors.push(
                `${label.id}: unknown logo ${label.category}/${label.logo}.`,
            );
        }

        const { crop } = label.art;
        if (
            !Number.isFinite(crop.focus.x) ||
            crop.focus.x < 0 ||
            crop.focus.x > 1 ||
            !Number.isFinite(crop.focus.y) ||
            crop.focus.y < 0 ||
            crop.focus.y > 1 ||
            !Number.isFinite(crop.scale) ||
            crop.scale < CROP_SCALE_MIN ||
            crop.scale > CROP_SCALE_MAX
        ) {
            errors.push(
                `${label.id}: crop focus must be within 0–1 and scale within ${CROP_SCALE_MIN}–${CROP_SCALE_MAX}.`,
            );
        }

        const options = label.art.options ?? [];
        if (options.some(option => !option)) {
            errors.push(
                `${label.id}: artwork options cannot contain empty values.`,
            );
        }
        if (new Set(options).size !== options.length) {
            errors.push(`${label.id}: artwork options contain duplicates.`);
        }
        if (options.length > 0 && !options.includes(label.art.asset)) {
            errors.push(
                `${label.id}: selected artwork is not in its configured options.`,
            );
        }

        if (label.contents.length === 0)
            errors.push(`${label.id}: no contents configured.`);
        for (const content of label.contents) {
            if (content.issues !== undefined && !validRange(content.issues)) {
                errors.push(`${label.id}: invalid issue range.`);
            }
            if (content.years !== undefined && !validRange(content.years)) {
                errors.push(`${label.id}: invalid year range.`);
            }
        }
    }
    return errors;
}

export function assertValidCatalog(
    layout: LayoutConfig,
    categories: CategoriesConfig,
    labels: LabelConfig[],
): void {
    const errors = validateCatalog(layout, categories, labels);
    if (errors.length > 0)
        throw new Error(`Catalog validation failed:\n- ${errors.join("\n- ")}`);
}
