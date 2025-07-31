import express from 'express';
import cors from 'cors';
import path from 'path';
import exp from 'constants';

const apiRoutes = require('.src/routes/api');
const blockLoader = require('.src/services/blockLoader');
const { log } = require('.src/utils/helpers');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.method} ${req.url}`);
        next();
    });
}

app.use('/api', apiRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..dist/index.html'));
    });
}

