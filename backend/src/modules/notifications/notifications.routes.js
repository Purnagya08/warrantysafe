const router = require('express').Router()
const controller = require('./notifications.controller')

router.get('/', controller.getAll)
router.patch('/read-all', controller.markAllRead)
router.patch('/:id/read', controller.markRead)

module.exports = router