import { ICodeBlock, IBlockCategories, IGeneratedTask, TDifficulty, IBlocksData } from '../types';

export class TaskGenerator {
    private blocksData: IBlocksData;

    constructor(blocksData: IBlocksData) {
        this.blocksData = blocksData;
    }

    generateTask(difficulty: TDifficulty): IGeneratedTask {
        const complexityConfig = this.blocksData.complexityLevels[difficulty];
        const blockCount = this.randomBetween(
            complexityConfig.blockCount.min,
            complexityConfig.blockCount.max
        );

        const availableBlocks = this.getAvailableBlocks(complexityConfig.types);
        const selectedBlocks = this.selectBlocks(availableBlocks, blockCount);
        const orderedBlocks = this.orderBlocksByDependencies(selectedBlocks);

        const { code, expectedOutput } = this.executeBlocks(orderedBlocks);

        return {
            id: this.generateId(),
            difficulty,
            blocks: orderedBlocks,
            expectedOutput,
            code
        };
    }

    private getAvailableBlocks(allowedTypes: (keyof IBlockCategories)[]): ICodeBlock[] {
        const blocks: ICodeBlock[] = [];

        for (const type of allowedTypes) {
            blocks.push(...this.blocksData.blocks[type]);
        }

        return blocks;
    }

    private selectBlocks(availableBlocks: ICodeBlock[], count: number): ICodeBlock[] {
        const selected: ICodeBlock[] = [];
        const used = new Set<string>();

        // Сначала выбираем блоки без зависимостей
        const independentBlocks = availableBlocks.filter(block => block.dependencies.length === 0);

        while (selected.length < count && independentBlocks.length > 0) {
            const randomIndex = Math.floor(Math.random() * independentBlocks.length);
            const block = independentBlocks[randomIndex];

            if (!used.has(block.id)) {
                selected.push(block);
                used.add(block.id);
            }

            independentBlocks.splice(randomIndex, 1);
        }

        // Затем добавляем блоки с зависимостями, если можем их удовлетворить
        const availableProviders = new Set<string>();
        selected.forEach(block => {
            block.provides.forEach(variable => availableProviders.add(variable));
        });

        const dependentBlocks = availableBlocks.filter(block =>
            block.dependencies.length > 0 &&
            !used.has(block.id) &&
            block.dependencies.every(dep => availableProviders.has(dep))
        );

        while (selected.length < count && dependentBlocks.length > 0) {
            const randomIndex = Math.floor(Math.random() * dependentBlocks.length);
            const block = dependentBlocks[randomIndex];

            if (!used.has(block.id)) {
                selected.push(block);
                used.add(block.id);

                // Обновляем список доступных переменных
                block.provides.forEach(variable => availableProviders.add(variable));
            }

            dependentBlocks.splice(randomIndex, 1);
        }

        return selected;
    }

    private orderBlocksByDependencies(blocks: ICodeBlock[]): ICodeBlock[] {
        const ordered: ICodeBlock[] = [];
        const provided = new Set<string>();
        const remaining = [...blocks];

        while (remaining.length > 0) {
            const readyBlocks = remaining.filter(block =>
                block.dependencies.every(dep => provided.has(dep))
            );

            if (readyBlocks.length === 0) {
                // Если нет готовых блоков, берем любой без зависимостей
                const independentBlocks = remaining.filter(block => block.dependencies.length === 0);
                if (independentBlocks.length > 0) {
                    readyBlocks.push(independentBlocks[0]);
                } else {
                    // Если совсем тупик, берем первый попавшийся
                    readyBlocks.push(remaining[0]);
                }
            }

            // Сортируем по приоритету (промисы имеют приоритет)
            readyBlocks.sort((a, b) => (b.priority || 0) - (a.priority || 0));

            const nextBlock = readyBlocks[0];
            ordered.push(nextBlock);

            // Добавляем переменные, которые предоставляет этот блок
            nextBlock.provides.forEach(variable => provided.add(variable));

            // Удаляем из оставшихся
            const index = remaining.findIndex(block => block.id === nextBlock.id);
            remaining.splice(index, 1);
        }

        return ordered;
    }

    private executeBlocks(blocks: ICodeBlock[]): { code: string, expectedOutput: string[] } {
        const code = blocks.map(block => block.code).join('\n\n');
        const output: string[] = [];

        // Сначала синхронный вывод
        blocks.forEach(block => {
            if (block.consoleOutput) {
                output.push(...block.consoleOutput);
            }
        });

        // Потом асинхронный (промисы имеют приоритет над таймерами)
        const asyncBlocks = blocks
            .filter(block => block.async && block.asyncOutput)
            .sort((a, b) => (b.priority || 0) - (a.priority || 0));

        asyncBlocks.forEach(block => {
            if (block.asyncOutput) {
                output.push(...block.asyncOutput);
            }
        });

        return { code, expectedOutput: output };
    }

    private randomBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 10);
    }
}