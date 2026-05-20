import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { errorHandler } from './middlewares/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import journalRoutes from './modules/journal/journal.routes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shouldSkipLogs = (req) =>
  req.path.startsWith('/playground') || req.get('x-api-playground') === 'true';

app.use(helmet());
app.use(cors());
app.use(morgan('dev', { skip: shouldSkipLogs }));
app.use(express.json());
app.get('/', (req, res) => {
  res.redirect('/playground');
});
app.get('/playground', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'playground', 'index.html'));
});
app.use('/playground', express.static(path.join(__dirname, 'public', 'playground')));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/journals', journalRoutes);

app.use(errorHandler);

export default app;
