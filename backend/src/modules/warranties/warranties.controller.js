const warrantiesService = require('./warranties.service');
const { successResponse } = require('../../utils/response.utils');

const listWarranties = async (req, res, next) => {
  try {
    const warranties = await warrantiesService.listWarranties(req.user.id);
    return successResponse(res, warranties, 'Warranties fetched successfully');
  } catch (error) {
    next(error);
  }
};

const createWarranty = async (req, res, next) => {
  try {
    const warranty = await warrantiesService.createWarranty(req.user.id, req.body);
    return successResponse(res, warranty, 'Warranty created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getWarranty = async (req, res, next) => {
  try {
    const warranty = await warrantiesService.getWarranty(req.user.id, req.params.id);
    return successResponse(res, warranty, 'Warranty fetched successfully');
  } catch (error) {
    next(error);
  }
};

const updateWarranty = async (req, res, next) => {
  try {
    const warranty = await warrantiesService.updateWarranty(req.user.id, req.params.id, req.body);
    return successResponse(res, warranty, 'Warranty updated successfully');
  } catch (error) {
    next(error);
  }
};

const getExpiringWarranties = async (req, res, next) => {
  try {
    const warranties = await warrantiesService.getExpiringWarranties(req.user.id);
    return successResponse(res, warranties, 'Expiring warranties fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { listWarranties, createWarranty, getWarranty, updateWarranty, getExpiringWarranties };
