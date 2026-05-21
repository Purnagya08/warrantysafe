const router = require('express').Router()
const controller = require('./products.controller')

router.get('/', controller.getAll)
router.post('/', controller.create)
router.get('/:id', controller.getOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)

module.exports = router