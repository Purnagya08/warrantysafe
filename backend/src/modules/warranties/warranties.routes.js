const router = require('express').Router()
const controller = require('./warranties.controller')

router.get('/', controller.getAll)
router.get('/expiring', controller.getExpiring)
router.post('/', controller.create)
router.get('/:id', controller.getOne)
router.put('/:id', controller.update)

module.exports = router