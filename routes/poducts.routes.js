const express = require('express');
const productController = require ("../controllers/product.controllers");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const router = express.Router();


router.get('/', productController.getAllProducts);
router.post(`/`,  protect, restrictTo('admin'), productController.createProduct);
router.get(`/:id`, productController.getProductsById);
router.put(`/:id`,  protect, restrictTo('admin'), productController.updateProduct);
router.delete(`:id`,  protect, restrictTo('admin'),productController.deleteProduct);

module.exports = router;
