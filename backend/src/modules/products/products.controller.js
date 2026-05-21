const service = require('./products.service')
const { sendSuccess } = require('../../utils/response.utils')
const DEMO_USER_ID = 'demo-user'

const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll(DEMO_USER_ID)
    sendSuccess(res, data, 'Products fetched')
  } catch (err) { next(err) }
}

const getOne = async (req, res, next) => {
  try {
    const data = await service.getOne(req.params.id, DEMO_USER_ID)
    sendSuccess(res, data, 'Product fetched')
  } catch (err) { next(err) }
}

const create = async (req, res, next) => {
  try {
    const data = await service.create(DEMO_USER_ID, req.body)
    sendSuccess(res, data, 'Product created', 201)
  } catch (err) { next(err) }
}

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, DEMO_USER_ID, req.body)
    sendSuccess(res, data, 'Product updated')
  } catch (err) { next(err) }
}

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id, DEMO_USER_ID)
    sendSuccess(res, {}, 'Product deleted')
  } catch (err) { next(err) }
}

module.exports = { getAll, getOne, create, update, remove }
