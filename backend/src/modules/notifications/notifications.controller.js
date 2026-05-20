const notificationsService = require('./notifications.service');
const { successResponse } = require('../../utils/response.utils');

const listNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationsService.listNotifications(req.user.id);
    return successResponse(res, notifications, 'Notifications fetched successfully');
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationsService.markAsRead(req.user.id, req.params.id);
    return successResponse(res, notification, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationsService.markAllAsRead(req.user.id);
    return successResponse(res, result, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

module.exports = { listNotifications, markAsRead, markAllAsRead };
