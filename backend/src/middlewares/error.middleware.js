const { ZodError } = require('zod');
const { errorResponse } = require('../utils/response.utils');

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ZodError) {
    const message = err.errors.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
    return errorResponse(res, message, 'Validation failed', 400);
  }

  if (err.name === 'MulterError' || err.message === 'Only PDF, JPEG, and PNG files are allowed') {
    return errorResponse(res, err.message, 'Upload failed', 400);
  }

  if (err.code === 'P2002') {
    return errorResponse(res, 'A record with this value already exists', 'Conflict', 409);
  }

  if (err.code === 'P2025') {
    return errorResponse(res, 'Record not found', 'Not found', 404);
  }

  const statusCode = err.statusCode || 500;
  const error = statusCode === 500 ? 'Internal server error' : err.message;
  const message = statusCode === 500 ? 'Request failed' : err.message;
  return errorResponse(res, error, message, statusCode);
};

module.exports = errorMiddleware;
