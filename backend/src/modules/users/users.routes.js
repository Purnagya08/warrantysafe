const express = require('express');
const usersController = require('./users.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/me', authMiddleware, usersController.getProfile);

module.exports = router;
