const prisma = require('../../config/db')
const path = require('path')

// TODO: Replace with actual OCR/AI API call (e.g. Google Vision, Textract)
const extractDocumentData = async (filePath) => {
  return { vendor: null, amount: null, date: null, productName: null }
}

const upload = async (userId, productId, file) => {
  const product = await prisma.product.findFirst({ where: { id: productId } })
  if (!product) throw { statusCode: 404, message: 'Product not found' }

  const extractedData = await extractDocumentData(file.path)

  return prisma.document.create({
    data: {
      productId,
      userId: 'demo-user',
      fileName: file.originalname,
      fileUrl: `/${file.path.replace(/\\/g, '/')}`,
      fileSize: file.size,
      mimeType: file.mimetype,
      extractedData,
    },
  })
}

const getAll = async (userId) => {
  return prisma.document.findMany({
    include: { product: { select: { id: true, name: true } } },
    orderBy: { uploadedAt: 'desc' },
  })
}

const getOne = async (id, userId) => {
  const doc = await prisma.document.findFirst({ where: { id } })
  if (!doc) throw { statusCode: 404, message: 'Document not found' }
  return doc
}

const remove = async (id, userId) => {
  const doc = await prisma.document.findFirst({ where: { id } })
  if (!doc) throw { statusCode: 404, message: 'Document not found' }
  return prisma.document.delete({ where: { id } })
}

module.exports = { upload, getAll, getOne, remove }
