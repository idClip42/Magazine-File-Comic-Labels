import fs from "node:fs";
import path from "node:path";
import { joinLabelConfigs } from "./label-config";
import {
    CategoriesConfig,
    LabelArtConfigById,
    LabelConfig,
    LabelEditorialConfig,
    LayoutConfig,
} from "./types";

export const configDirectory = path.join(process.cwd(), "config");
export const configPaths = {
    categories: path.join(configDirectory, "categories.json"),
    labels: path.join(configDirectory, "labels.json"),
    labelArt: path.join(configDirectory, "label-art.json"),
    layout: path.join(configDirectory, "layout.json"),
};

function readJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export const layout = readJson<LayoutConfig>(configPaths.layout);
export const categories = readJson<CategoriesConfig>(configPaths.categories);
export const editorialLabels = readJson<LabelEditorialConfig[]>(
    configPaths.labels,
);
export const labelArt = readJson<LabelArtConfigById>(configPaths.labelArt);
export const labels: LabelConfig[] = joinLabelConfigs(editorialLabels, labelArt);
