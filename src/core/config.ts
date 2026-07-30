import fs from "node:fs";
import path from "node:path";
import { CategoriesConfig, LabelConfig, LayoutConfig } from "./types";

export const configDirectory = path.join(process.cwd(), "config");
export const configPaths = {
    categories: path.join(configDirectory, "categories.json"),
    labels: path.join(configDirectory, "labels.json"),
    layout: path.join(configDirectory, "layout.json"),
};

function readJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export const layout = readJson<LayoutConfig>(configPaths.layout);
export const categories = readJson<CategoriesConfig>(configPaths.categories);
export const labels = readJson<LabelConfig[]>(configPaths.labels);
