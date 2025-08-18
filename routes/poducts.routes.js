const express = require('express');
const productController = require ("../controllers/product.controllers");
const router = express.Router();


router.get('/', productController.getAllProducts);
router.post(`/`, productController.createProduct);
router.get(`/:id`, productController.getProductsById);
router.put(`/:id`, productController.updateProduct);
router.delete(`:id`, productController.deleteProduct);

module.exports = router;
