const service = require('./notifications.service')
const { sendSuccess } = require('../../utils/response.utils')

const getAll = async (req, res, next) => {
  try { sendSuccess(res, await service.getAll(req.user.id), 'Notifications fetched') } catch (err) { next(err) }
}
const markRead = async (req, res, next) => {
  try { sendSuccess(res, await service.markRead(req.params.id, req.user.id), 'Marked as read') } catch (err) { next(err) }
}
const markAllRead = async (req, res, next) => {
  try { sendSuccess(res, await service.markAllRead(req.user.id), 'All marked as read') } catch (err) { next(err) }
}

module.exports = { getAll, markRead, markAllRead }