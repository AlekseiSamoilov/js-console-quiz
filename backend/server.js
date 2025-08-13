import express from 'express';
import cors from 'cors';
import path from 'path';
import exp from 'constants';
import { timeStamp } from 'console';

const apiRoutes = require('.src/routes/api');
const blockLoader = require('.src/services/blockLoader');
const { log } = require('.src/utils/helpers');

const app = express();
const PORT = process.env.PORT || 5000;

// Миддлвар
app.use(cors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Логирование запросов в девелопменте
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.method} ${req.url}`);
        next();
    });
}

app.use('/api', apiRoutes);

// Логирование запросов в дпродакшене
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..dist/index.html'));
    });
}

// АПИ маршруты
app.use('/api', apiRoutes);

// Статичтические файлы для продакшена
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    AONode.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..dist/index.html'));
    });
}

// Обработка глобальных ошибок
app.use((error, req, res, next) => {
    log('error', 'Ungandled error occurred', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method
    });

    res.status(500).json({
        error: {
            message: 'Internal server error',
            code: 500,
            timeStamp: new Date().toISOString()
        }
    });
});

// Обработка 404
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Not Found',
            code: 404,
            timeStamp: new Date().toISOString()
        }
    })
})

// Gracefull shutdown
process.on('SIGTERM', () => {
    log('info', 'SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    log('info', 'SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

const startServer = async () => {

    try {
        log('info', 'Loading code blocks...');
        const [blocks, complexity] = await Promise.all([
            blockLoader.loadBlocks(),
            blockLoader.loadComplexity()
        ]);

        const blocksCount = Object.values(blocks).reduce((sum, arr) => sum + arr.length, 0);
        const complexityLevels = Object.keys(complexity.levels || {}).length;

        app.listen(PORT, () => {
            console.log('\n🚀 JS Console Quiz Backend');
            console.log(`📡 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📚 Loaded ${blocksCount} code blocks`);
            console.log(`🎯 Available difficulty levels: ${complexityLevels}`);
            console.log(`⏰ Started at: ${new Date().toISOString()}\n`);

            if (process.env.NODE_ENV !== 'production') {
                console.log('📋 Available endpoints:');
                console.log(`   GET  http://localhost:${PORT}/api/health`);
                console.log(`   GET  http://localhost:${PORT}/api/task/:difficulty`);
                console.log(`   GET  http://localhost:${PORT}/api/difficulties`);
                console.log(`   GET  http://localhost:${PORT}/api/stats`);
                console.log(`   POST http://localhost:${PORT}/api/reload\n`);
            }
        });
    } catch (error) {
        log('error', 'Failed to start server', { error: error.message });
        process.exit(1);
    }
};

process.on('unhandledRejection', (reason, promise) => {
    log('error', 'Unhandled Rejection', { reason, promise });
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    log('error', 'Uncaught Exception', { error: error.message, stack: error.stack });
    process.exit(1);
});

startServer();

module.exports = app;



