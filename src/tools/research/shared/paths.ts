import path from "node:path";

export const researchDirectory = path.join(process.cwd(), "docs", "research");
export const nonMarvelResearchDirectory = path.join(researchDirectory, "non-marvel");

export const nonMarvelResearchPaths = {
    covers: path.join(nonMarvelResearchDirectory, "NON-MARVEL-COVER-URLS.json"),
    sources: path.join(nonMarvelResearchDirectory, "NON-MARVEL-COVER-SOURCES.json"),
    hipComicTargets: path.join(nonMarvelResearchDirectory, "NON-MARVEL-HIPCOMIC-TARGETS.json"),
    profiles: path.join(nonMarvelResearchDirectory, "NON-MARVEL-HARVEST-PROFILES.json"),
};
