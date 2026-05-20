const productsService = require('./products.service');
const { successResponse } = require('../../utils/response.utils');

const listProducts = async (req, res, next) => {
  try {
    const products = await productsService.listProducts(req.user.id);
    return successResponse(res, products, 'Products fetched successfully');
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await productsService.createProduct(req.user.id, req.body);
    return successResponse(res, product, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await productsService.getProduct(req.user.id, req.params.id);
    return successResponse(res, product, 'Product fetched successfully');
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productsService.updateProduct(req.user.id, req.params.id, req.body);
    return successResponse(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const result = await productsService.deleteProduct(req.user.id, req.params.id);
    return successResponse(res, result, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { listProducts, createProduct, getProduct, updateProduct, deleteProduct };
