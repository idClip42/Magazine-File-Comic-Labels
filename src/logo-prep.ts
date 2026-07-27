import fs from "node:fs";
import path from "node:path";
import { CategoriesConfig, LayoutConfig } from "./types";

type PreparedLogoManifestItem = {
  category: string;
  logo: string;
  source: string;
  output: string;
  sourceFills: string[];
  roles: Record<string, "primary" | "secondary">;
};

export type PreparedLogos = ReadonlyMap<string, string>;

function logoKey(category: string, logo: string): string {
  return `${category}/${logo}`;
}

function normalizeFill(fill: string): string | undefined {
  const raw = fill.trim().toLowerCase();
  if (raw === "none" || raw === "transparent" || raw === "currentcolor") return undefined;
  if (raw === "black") return "#000000";
  if (raw === "gray" || raw === "grey") return "#808080";
  const shortHex = raw.match(/^#([0-9a-f]{3})$/i);
  if (shortHex) return `#${shortHex[1].split("").map((part) => part + part).join("")}`;
  const hex = raw.match(/^#[0-9a-f]{6}$/i);
  return hex ? raw : undefined;
}

function extractFill(pathTag: string): string | undefined {
  const styleMatch = pathTag.match(/\bstyle\s*=\s*(["'])(.*?)\1/i);
  const styleFill = styleMatch?.[2].match(/(?:^|;)\s*fill\s*:\s*([^;]+)/i)?.[1];
  const attributeFill = pathTag.match(/\bfill\s*=\s*(["'])(.*?)\1/i)?.[2];
  return normalizeFill(styleFill ?? attributeFill ?? "");
}

function luminance(hex: string): number {
  const red = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const green = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const blue = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const linear = (channel: number) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
}

function addRole(pathTag: string, role: "primary" | "secondary"): string {
  const withoutExistingRole = pathTag.replace(/\sdata-logo-fill\s*=\s*(["']).*?\1/i, "");
  return withoutExistingRole.replace(/<path\b/i, `<path data-logo-fill="${role}"`);
}

function normalizeSvg(svg: string, source: string): { svg: string; fills: string[]; roles: Record<string, "primary" | "secondary"> } {
  const fills = new Set<string>();
  for (const match of svg.matchAll(/<path\b[^>]*>/gi)) {
    const fill = extractFill(match[0]);
    if (fill) fills.add(fill);
  }

  const sourceFills = [...fills];
  if (sourceFills.length === 0) throw new Error(`${source} has no supported filled paths.`);
  if (sourceFills.length > 2) throw new Error(`${source} has ${sourceFills.length} fill colors; V2 logos must use one black fill or black plus gray.`);

  const sorted = [...sourceFills].sort((left, right) => luminance(left) - luminance(right));
  const roles: Record<string, "primary" | "secondary"> = { [sorted[0]]: "primary" };
  if (sorted[1]) roles[sorted[1]] = "secondary";

  const withRoles = svg.replace(/<path\b[^>]*>/gi, (pathTag) => {
    const fill = extractFill(pathTag);
    return fill && roles[fill] ? addRole(pathTag, roles[fill]) : pathTag;
  });

  return {
    svg: withRoles.replace(/^\s*<\?xml[^>]*>\s*/i, ""),
    fills: sourceFills,
    roles
  };
}

export function prepareLogos(
  layout: LayoutConfig,
  categories: CategoriesConfig,
  outputDirectory: string
): PreparedLogos {
  const prepared = new Map<string, string>();
  const outputAssetsDirectory = path.join(outputDirectory, "prepared-logos");
  const manifest: PreparedLogoManifestItem[] = [];
  fs.mkdirSync(outputAssetsDirectory, { recursive: true });

  for (const [categoryId, category] of Object.entries(categories)) {
    for (const [logoId, logo] of Object.entries(category.logos)) {
      if (/^https?:\/\//i.test(logo.asset) || !logo.asset.toLowerCase().endsWith(".svg")) continue;

      const sourcePath = path.resolve(process.cwd(), layout.localAssetRoot, logo.asset);
      if (!fs.existsSync(sourcePath)) continue;

      const normalized = normalizeSvg(fs.readFileSync(sourcePath, "utf8"), logo.asset);
      const fileName = `${categoryId}--${logoId}.svg`;
      const outputPath = path.join(outputAssetsDirectory, fileName);
      fs.writeFileSync(outputPath, normalized.svg, "utf8");
      prepared.set(logoKey(categoryId, logoId), normalized.svg);
      manifest.push({
        category: categoryId,
        logo: logoId,
        source: logo.asset,
        output: path.join("prepared-logos", fileName).replace(/\\/g, "/"),
        sourceFills: normalized.fills,
        roles: normalized.roles
      });
    }
  }

  fs.writeFileSync(path.join(outputDirectory, "logo-preparation.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return prepared;
}
