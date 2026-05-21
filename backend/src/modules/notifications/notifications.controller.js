const service = require('./notifications.service')
const { sendSuccess } = require('../../utils/response.utils')
const DEMO_USER_ID = 'demo-user'

const getAll = async (req, res, next) => {
  try { sendSuccess(res, await service.getAll(DEMO_USER_ID), 'Notifications fetched') } catch (err) { next(err) }
}
const markRead = async (req, res, next) => {
  try { sendSuccess(res, await service.markRead(req.params.id, DEMO_USER_ID), 'Marked as read') } catch (err) { next(err) }
}
const markAllRead = async (req, res, next) => {
  try { sendSuccess(res, await service.markAllRead(DEMO_USER_ID), 'All marked as read') } catch (err) { next(err) }
}

module.exports = { getAll, markRead, markAllRead }
