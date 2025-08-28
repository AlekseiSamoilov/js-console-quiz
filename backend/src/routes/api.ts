import { Router } from 'express';
import { TaskGenerator } from '../services/TaskGenerator';
import { blocksData } from '../data/blocks/blocks';
import { TDifficulty } from '../types';

const router = Router();
const taskGenerator = new TaskGenerator(blocksData);

// Генерация новой задачи
router.get('/task/:difficulty?', (req, res) => {
    try {
        const difficulty = (req.params.difficulty as TDifficulty) || 'easy';

        // Проверяем валидность уровня сложности
        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({
                error: 'Invalid difficulty level. Use: easy, medium, or hard'
            });
        }

        const task = taskGenerator.generateTask(difficulty);

        res.json({
            success: true,
            task
        });
    } catch (error) {
        console.error('Error generating task:', error);
        res.status(500).json({
            error: 'Failed to generate task',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Получение списка доступных уровней сложности
router.get('/difficulties', (req, res) => {
    try {
        const difficulties = Object.keys(blocksData.complexityLevels).map(key => ({
            name: key,
            ...blocksData.complexityLevels[key as TDifficulty]
        }));

        res.json({
            success: true,
            difficulties
        });
    } catch (error) {
        console.error('Error getting difficulties:', error);
        res.status(500).json({
            error: 'Failed to get difficulties',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Проверка здоровья API
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is working',
        timestamp: new Date().toISOString()
    });
});

export default router;