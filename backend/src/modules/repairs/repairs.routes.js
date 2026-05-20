const express = require('express');
const repairsController = require('./repairs.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', repairsController.listRepairs);
router.post('/', repairsController.createRepair);
router.get('/:id', repairsController.getRepair);
router.put('/:id', repairsController.updateRepair);
router.delete('/:id', repairsController.deleteRepair);

module.exports = router;
