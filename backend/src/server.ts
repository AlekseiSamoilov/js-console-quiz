import express from 'express';
import cors from 'cors';
import path from 'path';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS настройки
app.use(cors({
    origin: process.env.CORS_ORIGIN ?
        process.env.CORS_ORIGIN.split(',') :
        ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
    credentials: true
}));

// Парсинг JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Логирование в production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        next();
    });
}

// API роуты
app.use('/api', apiRoutes);

// Статические файлы в production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
} else {
    // В development режиме показываем простую страницу
    app.get('/', (req, res) => {
        res.json({
            message: 'JS Quiz Backend API',
            endpoints: {
                'GET /api/health': 'Health check',
                'GET /api/difficulties': 'Get available difficulty levels',
                'GET /api/task/:difficulty': 'Generate task (easy/medium/hard)'
            }
        });
    });
}

// Обработка 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `${req.method} ${req.url} is not a valid endpoint`
    });
});

// Глобальная обработка ошибок
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API endpoints:`);
    console.log(`   GET /api/health`);
    console.log(`   GET /api/difficulties`);
    console.log(`   GET /api/task/:difficulty`);
});