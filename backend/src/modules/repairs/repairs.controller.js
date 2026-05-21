const service = require('./repairs.service')
const { sendSuccess } = require('../../utils/response.utils')
const DEMO_USER_ID = 'demo-user'

const getAll = async (req, res, next) => {
  try { sendSuccess(res, await service.getAll(DEMO_USER_ID), 'Repairs fetched') } catch (err) { next(err) }
}
const getOne = async (req, res, next) => {
  try { sendSuccess(res, await service.getOne(req.params.id, DEMO_USER_ID), 'Repair fetched') } catch (err) { next(err) }
}
const create = async (req, res, next) => {
  try { sendSuccess(res, await service.create(DEMO_USER_ID, req.body), 'Repair logged', 201) } catch (err) { next(err) }
}
const update = async (req, res, next) => {
  try { sendSuccess(res, await service.update(req.params.id, DEMO_USER_ID, req.body), 'Repair updated') } catch (err) { next(err) }
}
const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id, DEMO_USER_ID)
    sendSuccess(res, {}, 'Repair deleted')
  } catch (err) { next(err) }
}

module.exports = { getAll, getOne, create, update, remove }
