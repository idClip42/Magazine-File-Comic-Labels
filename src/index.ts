import fs from "node:fs";
import path from "node:path";
import { auditAssets } from "./audit";
import { categories, labels, layout } from "./config";
import { prepareLogos } from "./logo-prep";
import { renderDocument } from "./render";

const outputDirectory = path.join(process.cwd(), "dist", "v2");
fs.mkdirSync(outputDirectory, { recursive: true });

const preparedLogos = prepareLogos(layout, categories, outputDirectory);
const outputPath = path.join(outputDirectory, "index.html");
fs.writeFileSync(outputPath, renderDocument(labels, preparedLogos), "utf8");
console.log(`V2 HTML written to: ${outputPath}`);
console.log(`Rendered ${labels.length} labels.`);
console.log(`Prepared ${preparedLogos.size} local SVG logo variant(s).`);

const missingAssets = auditAssets(layout, categories, labels);
if (missingAssets.length > 0) {
    console.warn(
        `${missingAssets.length} local asset(s) are currently unavailable. Run npm run audit:assets for details.`,
    );
}
