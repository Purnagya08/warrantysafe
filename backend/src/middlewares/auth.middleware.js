const { verifyToken } = require('../utils/jwt.utils')
const { sendError } = require('../utils/response.utils')

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token provided', 401)
    }
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (err) {
    return sendError(res, 'Invalid or expired token', 401)
  }
}

module.exports = authMiddleware