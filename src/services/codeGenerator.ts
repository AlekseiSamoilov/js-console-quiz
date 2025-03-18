import { ITask, ICodeBlock, IComplexityLevel } from "@/types";

let cachedBlocks: Record<string, ICodeBlock[]> | null = null;
let cachedComplexityLevels: Record<string, IComplexityLevel> | null = null;

// load blocks from json file

export const loadCodeBlocks = async (): Promise<{
    blocks: Record<string, ICodeBlock[]>;
    complexityLevels: Record<string, IComplexityLevel>;
}> => {

    // if blocks are already loaded, return them
    if (cachedBlocks && cachedComplexityLevels) {
        return {
            blocks: cachedBlocks,
            complexityLevels: cachedComplexityLevels
        };
    }

    try {
        const response = await fetch('/assets/code-blocks.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        cachedBlocks = data.blocks;
        cachedComplexityLevels = data.complexityLevels;

        return {
            blocks: data.blocks,
            complexityLevels: data.complexityLevels
        };
    } catch (error) {
        console.error('Error loading code blocks:', error);

        // return empty object if there was an error
        return {
            blocks: {},
            complexityLevels: {}
        };
    }
};