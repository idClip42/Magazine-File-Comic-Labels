import { categories, labels, layout } from "../../core/config";
import { validateCatalog } from "../../core/catalog-validation";

const errors = validateCatalog(layout, categories, labels);
if (errors.length === 0) {
    console.log(`Catalog validation passed for ${labels.length} labels.`);
} else {
    console.error(`Catalog validation found ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
}
