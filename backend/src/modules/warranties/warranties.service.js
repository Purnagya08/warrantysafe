const prisma = require('../../config/db')

const getAll = async (userId) => {
  return prisma.warranty.findMany({
    where: { product: { userId } },
    include: { product: { select: { id: true, name: true, brand: true } } },
    orderBy: { endDate: 'asc' },
  })
}

const getOne = async (id, userId) => {
  const warranty = await prisma.warranty.findFirst({
    where: { id, product: { userId } },
    include: { product: true },
  })
  if (!warranty) throw { statusCode: 404, message: 'Warranty not found' }
  return warranty
}

const create = async (userId, data) => {
  const product = await prisma.product.findFirst({ where: { id: data.productId, userId } })
  if (!product) throw { statusCode: 404, message: 'Product not found' }
  return prisma.warranty.create({ data })
}

const update = async (id, userId, data) => {
  const warranty = await prisma.warranty.findFirst({ where: { id, product: { userId } } })
  if (!warranty) throw { statusCode: 404, message: 'Warranty not found' }
  return prisma.warranty.update({ where: { id }, data })
}

const getExpiring = async (userId) => {
  const now = new Date()
  const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  return prisma.warranty.findMany({
    where: {
      product: { userId },
      endDate: { gte: now, lte: in30 },
    },
    include: { product: { select: { id: true, name: true, brand: true } } },
  })
}

module.exports = { getAll, getOne, create, update, getExpiring }