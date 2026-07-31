import path from "node:path";
import { prepareLogos } from "../../build/logo-prep";
import { categories, layout } from "../../core/config";

const outputDirectory = path.join(process.cwd(), "dist", "v2");
const prepared = prepareLogos(layout, categories, outputDirectory);
console.log(`Prepared ${prepared.size} local SVG logo variant(s).`);
console.log(
    `Inspection manifest: ${path.join(outputDirectory, "logo-preparation.json")}`,
);
