const express = require('express');
const documentsController = require('./documents.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/upload', upload.single, documentsController.uploadDocument);
router.get('/', documentsController.listDocuments);
router.get('/:id', documentsController.getDocument);
router.delete('/:id', documentsController.deleteDocument);

module.exports = router;
