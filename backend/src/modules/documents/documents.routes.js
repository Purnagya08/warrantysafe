const router = require('express').Router()
const controller = require('./documents.controller')
const upload = require('../../middlewares/upload.middleware')

router.post('/upload', upload.single('file'), controller.upload)
router.get('/', controller.getAll)
router.get('/:id', controller.getOne)
router.delete('/:id', controller.remove)

module.exports = router