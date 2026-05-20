const fs = require('fs/promises');
const path = require('path');
const { z } = require('zod');
const prisma = require('../../config/db');
const { AppError } = require('../../utils/errors');
const { ensureProductOwnership } = require('../products/products.service');

const documentSchema = z.object({
  productId: z.string().min(1),
  type: z.enum(['RECEIPT', 'INVOICE', 'MANUAL', 'WARRANTY_CARD', 'OTHER']).default('OTHER'),
});

const extractDocumentData = async (filePath) => {
  // TODO: Replace with actual OCR/AI API call
  return { vendor: null, amount: null, date: null, productName: null };
};

const listDocuments = async (userId) => {
  return prisma.document.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { uploadedAt: 'desc' },
  });
};

const uploadDocument = async (userId, payload, file) => {
  if (!file) {
    throw new AppError('Document file is required', 400);
  }

  const data = documentSchema.parse(payload);
  await ensureProductOwnership(data.productId, userId);
  const extractedData = await extractDocumentData(file.path);

  return prisma.document.create({
    data: {
      productId: data.productId,
      userId,
      type: data.type,
      fileUrl: `/uploads/${file.filename}`,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      extractedData,
    },
  });
};

const getDocument = async (userId, documentId) => {
  const document = await prisma.document.findFirst({
    where: { id: documentId, userId },
    include: { product: true },
  });

  if (!document) {
    throw new AppError('Document not found', 404);
  }

  return document;
};

const deleteDocument = async (userId, documentId) => {
  const document = await getDocument(userId, documentId);
  await prisma.document.delete({ where: { id: documentId } });

  const relativePath = document.fileUrl.replace(/^\/uploads\//, '');
  const filePath = path.resolve(process.cwd(), process.env.UPLOADS_DIR || 'uploads', relativePath);
  await fs.unlink(filePath).catch(() => {});

  return { id: documentId };
};

module.exports = { listDocuments, uploadDocument, getDocument, deleteDocument, extractDocumentData };
