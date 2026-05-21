const service = require('./documents.service')
const { sendSuccess } = require('../../utils/response.utils')

const upload = async (req, res, next) => {
  try {
    if (!req.file) throw { statusCode: 400, message: 'No file uploaded' }
    const { productId } = req.body
    if (!productId) throw { statusCode: 400, message: 'productId is required' }
    const data = await service.upload(req.user.id, productId, req.file)
    sendSuccess(res, data, 'Document uploaded', 201)
  } catch (err) { next(err) }
}

const getAll = async (req, res, next) => {
  try { sendSuccess(res, await service.getAll(req.user.id), 'Documents fetched') } catch (err) { next(err) }
}

const getOne = async (req, res, next) => {
  try { sendSuccess(res, await service.getOne(req.params.id, req.user.id), 'Document fetched') } catch (err) { next(err) }
}

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id, req.user.id)
    sendSuccess(res, {}, 'Document deleted')
  } catch (err) { next(err) }
}

module.exports = { upload, getAll, getOne, remove }