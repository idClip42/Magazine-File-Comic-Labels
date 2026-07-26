import fs from "node:fs";
import path from "node:path";
import { CategoriesConfig, LabelConfig, LayoutConfig } from "./types";

function readJson<T>(fileName: string): T {
  const filePath = path.join(process.cwd(), "config", fileName);
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export const layout = readJson<LayoutConfig>("layout.json");
export const categories = readJson<CategoriesConfig>("categories.json");
export const labels = readJson<LabelConfig[]>("labels.json");
