const { z } = require('zod');
const prisma = require('../../config/db');
const { AppError } = require('../../utils/errors');

const nullableString = z.string().optional().nullable();
const productSchema = z.object({
  name: z.string().min(1),
  brand: nullableString,
  category: nullableString,
  purchaseDate: z.coerce.date().optional().nullable(),
  purchasePrice: z.coerce.number().nonnegative().optional().nullable(),
  retailerName: nullableString,
  serialNumber: nullableString,
  modelNumber: nullableString,
  notes: nullableString,
});

const updateProductSchema = productSchema.partial();

const ensureProductOwnership = async (productId, userId) => {
  const product = await prisma.product.findFirst({ where: { id: productId, userId } });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

const listProducts = async (userId) => {
  return prisma.product.findMany({
    where: { userId },
    include: { warranty: true, documents: true, repairs: true },
    orderBy: { createdAt: 'desc' },
  });
};

const createProduct = async (userId, payload) => {
  const data = productSchema.parse(payload);
  return prisma.product.create({ data: { ...data, userId } });
};

const getProduct = async (userId, productId) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, userId },
    include: { warranty: true, documents: true, repairs: true },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

const updateProduct = async (userId, productId, payload) => {
  await ensureProductOwnership(productId, userId);
  const data = updateProductSchema.parse(payload);
  return prisma.product.update({ where: { id: productId }, data });
};

const deleteProduct = async (userId, productId) => {
  await ensureProductOwnership(productId, userId);
  await prisma.product.delete({ where: { id: productId } });
  return { id: productId };
};

module.exports = {
  ensureProductOwnership,
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
