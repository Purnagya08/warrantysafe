const authService = require('./auth.service')
const { sendSuccess, sendError } = require('../../utils/response.utils')

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body)
    sendSuccess(res, result, 'Registration successful', 201)
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    sendSuccess(res, result, 'Login successful')
  } catch (err) {
    next(err)
  }
}

const logout = (req, res) => {
  sendSuccess(res, {}, 'Logged out successfully')
}

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id)
    sendSuccess(res, user, 'User fetched')
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, logout, getMe }