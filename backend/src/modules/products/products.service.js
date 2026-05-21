const prisma = require('../../config/db')
const DEMO_USER_ID = 'demo-user'

const ensureDemoUser = async () => {
  await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {},
    create: {
      id: DEMO_USER_ID,
      email: 'demo@warrantysafe.local',
      password: 'demo',
      name: 'Demo User',
    },
  })
}

const getWarrantyType = (type) => {
  if (type === 'extended') return 'EXTENDED'
  if (type === 'seller' || type === 'store') return 'STORE'
  return 'MANUFACTURER'
}

const addMonths = (date, months) => {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

const normalizeProductData = (data, options = { includeWarranty: true }) => {
  const { price, retailer, warrantyDuration, warrantyType, ...productData } = data
  const normalized = { ...productData }

  if (price !== undefined) normalized.purchasePrice = Number(price)
  if (retailer !== undefined) normalized.retailerName = retailer
  if (normalized.purchaseDate) normalized.purchaseDate = new Date(normalized.purchaseDate)

  const duration = Number(warrantyDuration)
  if (options.includeWarranty && duration > 0) {
    const startDate = normalized.purchaseDate || new Date()
    normalized.warranty = {
      create: {
        startDate,
        endDate: addMonths(startDate, duration),
        warrantyType: getWarrantyType(warrantyType),
      },
    }
  }

  return normalized
}

const getAll = async (userId) => {
  return prisma.product.findMany({
    include: { warranty: true, _count: { select: { documents: true, repairs: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

const getOne = async (id, userId) => {
  const product = await prisma.product.findFirst({
    where: { id },
    include: { warranty: true, documents: true, repairs: true },
  })
  if (!product) throw { statusCode: 404, message: 'Product not found' }
  return product
}

const create = async (userId, data) => {
  await ensureDemoUser()
  return prisma.product.create({
    data: { ...normalizeProductData(data), userId: DEMO_USER_ID },
    include: { warranty: true },
  })
}

const update = async (id, userId, data) => {
  const product = await prisma.product.findFirst({ where: { id } })
  if (!product) throw { statusCode: 404, message: 'Product not found' }
  return prisma.product.update({ where: { id }, data: normalizeProductData(data, { includeWarranty: false }) })
}

const remove = async (id, userId) => {
  const product = await prisma.product.findFirst({ where: { id } })
  if (!product) throw { statusCode: 404, message: 'Product not found' }
  return prisma.product.delete({ where: { id } })
}

module.exports = { getAll, getOne, create, update, remove }
