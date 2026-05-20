const authService = require('./auth.service');
const { successResponse } = require('../../utils/response.utils');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, result, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, result, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    return successResponse(res, {}, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    return successResponse(res, req.user, 'Current user fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, me };
