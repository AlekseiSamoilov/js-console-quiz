export interface ICodeBlock {
    id: string;
    code: string;
    dependencies: string[];
    provides: string[];
    consoleOutput: string[];
    asyncOutput?: string[];
    async?: boolean;
    proirity?: number;
}

export interface IBlockCategories {
    variables: ICodeBlock[];
    reassignments: ICodeBlock[];
    timers: ICodeBlock[];
    promises: ICodeBlock[];
    loops: ICodeBlock[];
    conditionals: ICodeBlock[];
}

export interface IComplexityLevels {
    blockCount: {
        min: number;
        max: number;
    };
    types: (keyof IBlockCategories)[];
}

export interface IBlockData {
    blocks: IBlockCategories;
    complexityLevels: IComplexityLevels;
}

export interface IGeneratedTask {
    id: string;
    difficulty: keyof IComplexityLevels;
    blocks: ICodeBlock[];
    expectedOutput: string[];
    code: string;
}

export type Difficulty = keyof IComplexityLevels