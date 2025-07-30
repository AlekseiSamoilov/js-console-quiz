import express from 'express';
import cors from 'cors';
import path from 'path';
import exp from 'constants';

const apiRouter = require('.src/routes/api');
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


