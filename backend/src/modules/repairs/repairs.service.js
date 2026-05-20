const { z } = require('zod');
const prisma = require('../../config/db');
const { AppError } = require('../../utils/errors');
const { ensureProductOwnership } = require('../products/products.service');

const repairSchema = z.object({
  productId: z.string().min(1),
  issue: z.string().min(1),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  repairCenter: z.string().optional().nullable(),
  cost: z.coerce.number().nonnegative().optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const updateRepairSchema = repairSchema.omit({ productId: true }).partial();

const ensureRepairOwnership = async (repairId, userId) => {
  const repair = await prisma.repair.findFirst({
    where: { id: repairId, product: { userId } },
    include: { product: true },
  });

  if (!repair) {
    throw new AppError('Repair not found', 404);
  }

  return repair;
};

const listRepairs = async (userId) => {
  return prisma.repair.findMany({
    where: { product: { userId } },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });
};

const createRepair = async (userId, payload) => {
  const data = repairSchema.parse(payload);
  await ensureProductOwnership(data.productId, userId);
  return prisma.repair.create({ data });
};

const getRepair = async (userId, repairId) => {
  return ensureRepairOwnership(repairId, userId);
};

const updateRepair = async (userId, repairId, payload) => {
  await ensureRepairOwnership(repairId, userId);
  const data = updateRepairSchema.parse(payload);
  return prisma.repair.update({ where: { id: repairId }, data });
};

const deleteRepair = async (userId, repairId) => {
  await ensureRepairOwnership(repairId, userId);
  await prisma.repair.delete({ where: { id: repairId } });
  return { id: repairId };
};

module.exports = { listRepairs, createRepair, getRepair, updateRepair, deleteRepair };
