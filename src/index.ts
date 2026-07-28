import fs from "node:fs";
import path from "node:path";
import { auditAssets } from "./audit";
import { categories, labels, layout } from "./config";
import { buildEditorConfig } from "./editor-config";
import { prepareLogos } from "./logo-prep";

const outputDirectory = path.join(process.cwd(), "dist", "v2");
fs.mkdirSync(outputDirectory, { recursive: true });

const preparedLogos = prepareLogos(layout, categories, outputDirectory);
const outputPath = path.join(outputDirectory, "index.html");
const config = buildEditorConfig(layout, categories, labels, preparedLogos);
const serializedConfig = JSON.stringify(config)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
const configPlaceholder = "window.__COMIC_LABELS_CONFIG__ = undefined;";
const builtDocument = fs.readFileSync(outputPath, "utf8");
if (!builtDocument.includes(configPlaceholder)) {
    throw new Error("Vue configuration placeholder was not found in the Vite build.");
}
fs.writeFileSync(
    outputPath,
    builtDocument.replace(
        configPlaceholder,
        `window.__COMIC_LABELS_CONFIG__ = ${serializedConfig};`,
    ),
    "utf8",
);
console.log(`Vue configuration embedded in: ${outputPath}`);
console.log(`Prepared ${labels.length} labels for the Vue application.`);
console.log(`Prepared ${preparedLogos.size} local SVG logo variant(s).`);

const missingAssets = auditAssets(layout, categories, labels);
if (missingAssets.length > 0) {
    console.warn(
        `${missingAssets.length} local asset(s) are currently unavailable. Run npm run audit:assets for details.`,
    );
}
