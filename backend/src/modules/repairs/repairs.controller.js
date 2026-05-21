const service = require('./repairs.service')
const { sendSuccess } = require('../../utils/response.utils')

const getAll = async (req, res, next) => {
  try { sendSuccess(res, await service.getAll(req.user.id), 'Repairs fetched') } catch (err) { next(err) }
}
const getOne = async (req, res, next) => {
  try { sendSuccess(res, await service.getOne(req.params.id, req.user.id), 'Repair fetched') } catch (err) { next(err) }
}
const create = async (req, res, next) => {
  try { sendSuccess(res, await service.create(req.user.id, req.body), 'Repair logged', 201) } catch (err) { next(err) }
}
const update = async (req, res, next) => {
  try { sendSuccess(res, await service.update(req.params.id, req.user.id, req.body), 'Repair updated') } catch (err) { next(err) }
}
const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id, req.user.id)
    sendSuccess(res, {}, 'Repair deleted')
  } catch (err) { next(err) }
}

module.exports = { getAll, getOne, create, update, remove }