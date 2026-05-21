const service = require('./warranties.service')
const { sendSuccess } = require('../../utils/response.utils')
const DEMO_USER_ID = 'demo-user'

const getAll = async (req, res, next) => {
  try { sendSuccess(res, await service.getAll(DEMO_USER_ID), 'Warranties fetched') } catch (err) { next(err) }
}

const getOne = async (req, res, next) => {
  try { sendSuccess(res, await service.getOne(req.params.id, DEMO_USER_ID), 'Warranty fetched') } catch (err) { next(err) }
}

const create = async (req, res, next) => {
  try { sendSuccess(res, await service.create(DEMO_USER_ID, req.body), 'Warranty created', 201) } catch (err) { next(err) }
}

const update = async (req, res, next) => {
  try { sendSuccess(res, await service.update(req.params.id, DEMO_USER_ID, req.body), 'Warranty updated') } catch (err) { next(err) }
}

const getExpiring = async (req, res, next) => {
  try { sendSuccess(res, await service.getExpiring(DEMO_USER_ID), 'Expiring warranties fetched') } catch (err) { next(err) }
}

module.exports = { getAll, getOne, create, update, getExpiring }
