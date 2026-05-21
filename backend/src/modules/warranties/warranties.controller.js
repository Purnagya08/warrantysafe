const service = require('./warranties.service')
const { sendSuccess } = require('../../utils/response.utils')

const getAll = async (req, res, next) => {
  try { sendSuccess(res, await service.getAll(req.user.id), 'Warranties fetched') } catch (err) { next(err) }
}

const getOne = async (req, res, next) => {
  try { sendSuccess(res, await service.getOne(req.params.id, req.user.id), 'Warranty fetched') } catch (err) { next(err) }
}

const create = async (req, res, next) => {
  try { sendSuccess(res, await service.create(req.user.id, req.body), 'Warranty created', 201) } catch (err) { next(err) }
}

const update = async (req, res, next) => {
  try { sendSuccess(res, await service.update(req.params.id, req.user.id, req.body), 'Warranty updated') } catch (err) { next(err) }
}

const getExpiring = async (req, res, next) => {
  try { sendSuccess(res, await service.getExpiring(req.user.id), 'Expiring warranties fetched') } catch (err) { next(err) }
}

module.exports = { getAll, getOne, create, update, getExpiring }