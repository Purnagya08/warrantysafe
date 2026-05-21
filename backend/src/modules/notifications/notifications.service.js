const prisma = require('../../config/db')

const getAll = async (userId) => {
  return prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

const markRead = async (id, userId) => {
  const notif = await prisma.notification.findFirst({ where: { id } })
  if (!notif) throw { statusCode: 404, message: 'Notification not found' }
  return prisma.notification.update({ where: { id }, data: { isRead: true } })
}

const markAllRead = async (userId) => {
  return prisma.notification.updateMany({ where: { userId: 'demo-user' }, data: { isRead: true } })
}

module.exports = { getAll, markRead, markAllRead }
