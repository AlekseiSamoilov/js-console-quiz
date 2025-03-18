export interface ICodeBlock {
    id: string;
    code: string;
    dependencies: string[];
    provides: string[];
    async?: boolean;
    priority?: number;
}

export interface IComplexityLevel {
    blockCount: {
        min: number;
        max: number;
    };
    types: string[];
}

export interface ITask {
    id: string;
    code: string;
    answer?: string;
}

export interface ICodeExecutionResult {
    output: string;
    error?: string;
}

export interface IAppState {
    currentTask: ITask | null;
    userAnswer: string;
    isSubmitted: boolean;
    result: {
        output: string;
        isCorrect: boolean;
    } | null;
    loading: boolean;
    error: string | null;
    difficulty: 'easy' | 'medium' | 'hard';
}