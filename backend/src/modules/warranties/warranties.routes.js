const express = require('express');
const warrantiesController = require('./warranties.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', warrantiesController.listWarranties);
router.post('/', warrantiesController.createWarranty);
router.get('/expiring', warrantiesController.getExpiringWarranties);
router.get('/:id', warrantiesController.getWarranty);
router.put('/:id', warrantiesController.updateWarranty);

module.exports = router;
