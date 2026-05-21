const service = require('./products.service')
const { sendSuccess, sendError } = require('../../utils/response.utils')

const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll(req.user.id)
    sendSuccess(res, data, 'Products fetched')
  } catch (err) { next(err) }
}

const getOne = async (req, res, next) => {
  try {
    const data = await service.getOne(req.params.id, req.user.id)
    sendSuccess(res, data, 'Product fetched')
  } catch (err) { next(err) }
}

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.user.id, req.body)
    sendSuccess(res, data, 'Product created', 201)
  } catch (err) { next(err) }
}

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.user.id, req.body)
    sendSuccess(res, data, 'Product updated')
  } catch (err) { next(err) }
}

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id, req.user.id)
    sendSuccess(res, {}, 'Product deleted')
  } catch (err) { next(err) }
}

module.exports = { getAll, getOne, create, update, remove }