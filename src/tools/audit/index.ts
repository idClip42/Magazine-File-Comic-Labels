import { auditAssets } from "../../core/audit";
import { categories, labels, layout } from "../../core/config";

const missing = auditAssets(layout, categories, labels);
if (missing.length === 0) {
    console.log("All local assets are available.");
} else {
    console.log(`${missing.length} local asset(s) are currently unavailable:`);
    for (const item of missing) console.log(`- ${item}`);
}
