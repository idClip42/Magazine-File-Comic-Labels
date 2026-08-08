import { validateCatalog } from "../../core/catalog-validation";
import { validateLabelConfigSplit } from "../../core/label-config";
import {
    categories,
    editorialLabels,
    labelArt,
    labels,
    layout,
} from "../../core/config";

const errors = [
    ...validateLabelConfigSplit(editorialLabels, labelArt),
    ...validateCatalog(layout, categories, labels),
];
if (errors.length === 0) {
    console.log(`Catalog validation passed for ${labels.length} labels.`);
} else {
    console.error(`Catalog validation found ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
}
