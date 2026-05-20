const prisma = require('../../config/db');
const { AppError } = require('../../utils/errors');

const listNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

const markAsRead = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({ where: { id: notificationId, userId } });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

const markAllAsRead = async (userId) => {
  const result = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return { updatedCount: result.count };
};

module.exports = { listNotifications, markAsRead, markAllAsRead };
