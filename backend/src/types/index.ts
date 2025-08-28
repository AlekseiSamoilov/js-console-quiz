export interface ICodeBlock {
    id: string;
    code: string;
    dependencies: string[];
    provides: string[];
    consoleOutput: string[];
    asyncOutput?: string[];
    async?: boolean;
    priority?: number;
}

export interface IBlockCategories {
    variables: ICodeBlock[];
    reassignments: ICodeBlock[];
    timers: ICodeBlock[];
    promises: ICodeBlock[];
    loops: ICodeBlock[];
    conditionals: ICodeBlock[];
}

export interface IComplexityConfig {
    blockCount: {
        min: number;
        max: number;
    };
    types: (keyof IBlockCategories)[];
}

export type TDifficulty = 'easy' | 'medium' | 'hard';

export interface IComplexityLevels {
    easy: IComplexityConfig;
    medium: IComplexityConfig;
    hard: IComplexityConfig;
}

export interface IBlocksData {
    blocks: IBlockCategories;
    complexityLevels: IComplexityLevels;
}

export interface IGeneratedTask {
    id: string;
    difficulty: TDifficulty;
    blocks: ICodeBlock[];
    expectedOutput: string[];
    code: string;
}