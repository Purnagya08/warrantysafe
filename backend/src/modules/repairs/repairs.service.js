const prisma = require('../../config/db')

const getAll = async (userId) => {
  return prisma.repair.findMany({
    where: { product: { userId } },
    include: { product: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

const getOne = async (id, userId) => {
  const repair = await prisma.repair.findFirst({ where: { id, product: { userId } } })
  if (!repair) throw { statusCode: 404, message: 'Repair not found' }
  return repair
}

const create = async (userId, data) => {
  const product = await prisma.product.findFirst({ where: { id: data.productId, userId } })
  if (!product) throw { statusCode: 404, message: 'Product not found' }
  return prisma.repair.create({ data })
}

const update = async (id, userId, data) => {
  const repair = await prisma.repair.findFirst({ where: { id, product: { userId } } })
  if (!repair) throw { statusCode: 404, message: 'Repair not found' }
  return prisma.repair.update({ where: { id }, data })
}

const remove = async (id, userId) => {
  const repair = await prisma.repair.findFirst({ where: { id, product: { userId } } })
  if (!repair) throw { statusCode: 404, message: 'Repair not found' }
  return prisma.repair.delete({ where: { id } })
}

module.exports = { getAll, getOne, create, update, remove }