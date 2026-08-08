import type {
    LabelArtConfigById,
    LabelConfig,
    LabelEditorialConfig,
} from "./types";

/** Validates the explicit one-to-one relationship between catalog facts and art state. */
export function validateLabelConfigSplit(
    editorialLabels: LabelEditorialConfig[],
    labelArt: LabelArtConfigById,
): string[] {
    const errors: string[] = [];
    const labelIds = new Set<string>();
    for (const label of editorialLabels) {
        if (!label.id) continue;
        if (labelIds.has(label.id)) {
            errors.push(`Duplicate label ID: ${label.id}.`);
            continue;
        }
        labelIds.add(label.id);
        if (!labelArt[label.id]) {
            errors.push(`${label.id}: missing artwork configuration.`);
        }
    }
    for (const id of Object.keys(labelArt)) {
        if (!labelIds.has(id)) {
            errors.push(`${id}: artwork configuration has no matching label.`);
        }
    }
    return errors;
}

/** Joins ordered editorial records to their UI-managed artwork state. */
export function joinLabelConfigs(
    editorialLabels: LabelEditorialConfig[],
    labelArt: LabelArtConfigById,
): LabelConfig[] {
    const errors = validateLabelConfigSplit(editorialLabels, labelArt);
    if (errors.length > 0) {
        throw new Error(
            `Label configuration split is invalid:\n- ${errors.join("\n- ")}`,
        );
    }
    return editorialLabels.map(label => ({
        ...label,
        art: labelArt[label.id],
    }));
}
