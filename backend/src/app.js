require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const productsRoutes = require('./modules/products/products.routes');
const warrantiesRoutes = require('./modules/warranties/warranties.routes');
const documentsRoutes = require('./modules/documents/documents.routes');
const repairsRoutes = require('./modules/repairs/repairs.routes');
const notificationsRoutes = require('./modules/notifications/notifications.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const { successResponse, errorResponse } = require('./utils/response.utils');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(process.cwd(), process.env.UPLOADS_DIR || 'uploads')));

app.get('/health', (req, res) => successResponse(res, { status: 'ok' }, 'WarrantySafe API is healthy'));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/warranties', warrantiesRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/repairs', repairsRoutes);
app.use('/api/notifications', notificationsRoutes);

app.use((req, res) => errorResponse(res, 'Route not found', 'Not found', 404));
app.use(errorMiddleware);

module.exports = app;
