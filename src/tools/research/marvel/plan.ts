import path from "node:path";
import rawPlan from "./harvest-plan.json";
import type { MarvelRun } from "../shared/marvel";

export type MarvelHarvestPlan = {
    description: string;
    queue: {
        path: string;
        seriesByLabel: Record<string, number>;
    };
    runs: MarvelRun[];
    coverRequestDelayMs: number;
    outputs: {
        pages: string;
        covers: string;
    };
};

export const marvelHarvestPlan = rawPlan as unknown as MarvelHarvestPlan;
export const marvelHarvestPlanPath = "src/tools/research/marvel/harvest-plan.json";

function fromRepositoryRoot(filePath: string): string {
    return path.join(process.cwd(), filePath);
}

export const marvelHarvestPaths = {
    queue: fromRepositoryRoot(marvelHarvestPlan.queue.path),
    pages: fromRepositoryRoot(marvelHarvestPlan.outputs.pages),
    covers: fromRepositoryRoot(marvelHarvestPlan.outputs.covers),
};
