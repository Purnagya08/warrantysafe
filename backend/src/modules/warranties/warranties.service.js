const { z } = require('zod');
const prisma = require('../../config/db');
const { AppError } = require('../../utils/errors');
const { ensureProductOwnership } = require('../products/products.service');

const warrantySchema = z.object({
  productId: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  warrantyType: z.enum(['MANUFACTURER', 'EXTENDED', 'STORE']),
  providerName: z.string().optional().nullable(),
  coverageDetails: z.string().optional().nullable(),
  reminderSent: z.boolean().optional(),
});

const updateWarrantySchema = warrantySchema.omit({ productId: true }).partial();

const ensureWarrantyOwnership = async (warrantyId, userId) => {
  const warranty = await prisma.warranty.findFirst({
    where: { id: warrantyId, product: { userId } },
    include: { product: true },
  });

  if (!warranty) {
    throw new AppError('Warranty not found', 404);
  }

  return warranty;
};

const listWarranties = async (userId) => {
  return prisma.warranty.findMany({
    where: { product: { userId } },
    include: { product: true },
    orderBy: { endDate: 'asc' },
  });
};

const createWarranty = async (userId, payload) => {
  const data = warrantySchema.parse(payload);
  await ensureProductOwnership(data.productId, userId);
  return prisma.warranty.create({ data });
};

const getWarranty = async (userId, warrantyId) => {
  return ensureWarrantyOwnership(warrantyId, userId);
};

const updateWarranty = async (userId, warrantyId, payload) => {
  await ensureWarrantyOwnership(warrantyId, userId);
  const data = updateWarrantySchema.parse(payload);
  return prisma.warranty.update({ where: { id: warrantyId }, data });
};

const getExpiringWarranties = async (userId) => {
  const now = new Date();
  const inThirtyDays = new Date(now);
  inThirtyDays.setDate(inThirtyDays.getDate() + 30);

  return prisma.warranty.findMany({
    where: {
      product: { userId },
      endDate: { gte: now, lte: inThirtyDays },
    },
    include: { product: true },
    orderBy: { endDate: 'asc' },
  });
};

module.exports = {
  listWarranties,
  createWarranty,
  getWarranty,
  updateWarranty,
  getExpiringWarranties,
};
