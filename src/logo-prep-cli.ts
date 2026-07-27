import path from "node:path";
import { categories, layout } from "./config";
import { prepareLogos } from "./logo-prep";

const outputDirectory = path.join(process.cwd(), "dist", "v2");
const prepared = prepareLogos(layout, categories, outputDirectory);
console.log(`Prepared ${prepared.size} local SVG logo variant(s).`);
console.log(`Inspection manifest: ${path.join(outputDirectory, "logo-preparation.json")}`);
