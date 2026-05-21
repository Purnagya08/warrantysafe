const prisma = require('../../config/db')

const getAll = async (userId) => {
  return prisma.product.findMany({
    where: { userId },
    include: { warranty: true, _count: { select: { documents: true, repairs: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

const getOne = async (id, userId) => {
  const product = await prisma.product.findFirst({
    where: { id, userId },
    include: { warranty: true, documents: true, repairs: true },
  })
  if (!product) throw { statusCode: 404, message: 'Product not found' }
  return product
}

const create = async (userId, data) => {
  return prisma.product.create({ data: { ...data, userId } })
}

const update = async (id, userId, data) => {
  const product = await prisma.product.findFirst({ where: { id, userId } })
  if (!product) throw { statusCode: 404, message: 'Product not found' }
  return prisma.product.update({ where: { id }, data })
}

const remove = async (id, userId) => {
  const product = await prisma.product.findFirst({ where: { id, userId } })
  if (!product) throw { statusCode: 404, message: 'Product not found' }
  return prisma.product.delete({ where: { id } })
}

module.exports = { getAll, getOne, create, update, remove }