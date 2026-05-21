const router = require('express').Router()
const controller = require('./auth.controller')
const authMiddleware = require('../../middlewares/auth.middleware')

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/logout', controller.logout)
router.get('/me', authMiddleware, controller.getMe)

module.exports = router