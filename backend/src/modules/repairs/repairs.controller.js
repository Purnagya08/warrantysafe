const repairsService = require('./repairs.service');
const { successResponse } = require('../../utils/response.utils');

const listRepairs = async (req, res, next) => {
  try {
    const repairs = await repairsService.listRepairs(req.user.id);
    return successResponse(res, repairs, 'Repairs fetched successfully');
  } catch (error) {
    next(error);
  }
};

const createRepair = async (req, res, next) => {
  try {
    const repair = await repairsService.createRepair(req.user.id, req.body);
    return successResponse(res, repair, 'Repair logged successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getRepair = async (req, res, next) => {
  try {
    const repair = await repairsService.getRepair(req.user.id, req.params.id);
    return successResponse(res, repair, 'Repair fetched successfully');
  } catch (error) {
    next(error);
  }
};

const updateRepair = async (req, res, next) => {
  try {
    const repair = await repairsService.updateRepair(req.user.id, req.params.id, req.body);
    return successResponse(res, repair, 'Repair updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteRepair = async (req, res, next) => {
  try {
    const result = await repairsService.deleteRepair(req.user.id, req.params.id);
    return successResponse(res, result, 'Repair deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { listRepairs, createRepair, getRepair, updateRepair, deleteRepair };
