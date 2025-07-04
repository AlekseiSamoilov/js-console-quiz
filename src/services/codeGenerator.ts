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
        const response = await fetch('/src/assets/code-module.json');

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

const checkDependencies = (block: ICodeBlock, availableVars: string[]): boolean => {
    if (!block.dependencies || block.dependencies.length === 0) return true;
    return block.dependencies.every(dep => availableVars.includes(dep));
};

const getRandomElement = <T>(array: T[]): T => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};

export const generateRandomTask = async (
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<ITask> => {
    const { blocks, complexityLevels } = await loadCodeBlocks();

    if (Object.keys(blocks).length === 0) {
        return {
            id: 'default',
            code: 'console.log(Hello, World!);'
        };
    }

    const complexityLevel = complexityLevels[difficulty];

    if (!complexityLevel) {
        throw new Error(`Unknown difficulty level: ${difficulty}`);
    }

    const blockCount = Math.floor(
        Math.random() * (complexityLevel.blockCount.max - complexityLevel.blockCount.min + 1)
    ) + complexityLevel.blockCount.min;

    const availableTypes = complexityLevel.types;

    const selectedBlocks: ICodeBlock[] = [];
    const availableVars: string[] = [];
    const usedBlockIds: Set<string> = new Set();

    if (blocks.variables && blocks.variables.length > 0) {
        const variableBlocks = blocks.variables.filter(block => !usedBlockIds.has(block.id));

        if (variableBlocks.length > 0) {
            const initialBlock = getRandomElement(variableBlocks);
            selectedBlocks.push(initialBlock);
            usedBlockIds.add(initialBlock.id);

            if (initialBlock.provides) {
                availableVars.push(...initialBlock.provides);
            }
        }
    }

    for (let i = selectedBlocks.length; i < blockCount; i++) {
        const blockType = getRandomElement(availableTypes);

        if (!blocks[blockType] || blocks[blockType].length === 0) {
            continue;
        }

        const validBlocks = blocks[blockType].filter(
            block => !usedBlockIds.has(block.id) && checkDependencies(block, availableVars)
        );

        if (validBlocks.length === 0) {
            i--;
            continue;
        }

        const selectedBlock = getRandomElement(validBlocks);
        selectedBlocks.push(selectedBlock);
        usedBlockIds.add(selectedBlock.id);

        if (selectedBlock.provides) {
            availableVars.push(...selectedBlock.provides);
        }
    }

    selectedBlocks.sort((a, b) => {
        const aAsync = a.async || false;
        const bAsync = b.async || false;

        if (aAsync && !bAsync) return 1;
        if (!aAsync && bAsync) return -1;

        if (aAsync && bAsync) {
            const aPriority = a.priority || 0;
            const bPriority = b.priority || 0;
            return aPriority - bPriority;
        }

        return 0;
    });


    let generatedCode = '';
    selectedBlocks.forEach(block => {
        generatedCode += block.code + '\n\n';
    });

    const task: ITask = {
        id: `generated-${Date.now()}`,
        code: generatedCode.trim()
    };

    return task;
};

export const generateTaskWithDifficulty = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<ITask> => {
    return generateRandomTask(difficulty);
};
