const usersService = require('./users.service');
const { successResponse } = require('../../utils/response.utils');

const getProfile = async (req, res, next) => {
  try {
    const user = await usersService.getProfile(req.user.id);
    return successResponse(res, user, 'Profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile };
