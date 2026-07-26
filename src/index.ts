import fs from "node:fs";
import path from "node:path";
import { auditAssets } from "./audit";
import { categories, labels, layout } from "./config";
import { renderDocument } from "./render";

const outputDirectory = path.join(process.cwd(), "dist", "v2");
fs.mkdirSync(outputDirectory, { recursive: true });

const outputPath = path.join(outputDirectory, "index.html");
fs.writeFileSync(outputPath, renderDocument(labels), "utf8");
console.log(`V2 HTML written to: ${outputPath}`);
console.log(`Rendered ${labels.length} labels.`);

const missingAssets = auditAssets(layout, categories, labels);
if (missingAssets.length > 0) {
  console.warn(`${missingAssets.length} local asset(s) are currently unavailable. Run npm run audit:assets for details.`);
}
