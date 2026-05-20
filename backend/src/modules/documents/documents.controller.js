const documentsService = require('./documents.service');
const { successResponse } = require('../../utils/response.utils');

const uploadDocument = async (req, res, next) => {
  try {
    const document = await documentsService.uploadDocument(req.user.id, req.body, req.file);
    return successResponse(res, document, 'Document uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
};

const listDocuments = async (req, res, next) => {
  try {
    const documents = await documentsService.listDocuments(req.user.id);
    return successResponse(res, documents, 'Documents fetched successfully');
  } catch (error) {
    next(error);
  }
};

const getDocument = async (req, res, next) => {
  try {
    const document = await documentsService.getDocument(req.user.id, req.params.id);
    return successResponse(res, document, 'Document fetched successfully');
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const result = await documentsService.deleteDocument(req.user.id, req.params.id);
    return successResponse(res, result, 'Document deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadDocument, listDocuments, getDocument, deleteDocument };
