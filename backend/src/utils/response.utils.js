const successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data, message });
};

const errorResponse = (res, error = 'Internal server error', message = 'Request failed', statusCode = 500) => {
  return res.status(statusCode).json({ success: false, error, message });
};

module.exports = { successResponse, errorResponse };
