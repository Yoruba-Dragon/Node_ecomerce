const express = require('express');
const cartController = require('../controllers/carts.controllers');

const router = express.Router();

router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);
router.delete('/remove/:id', cartController.removeItem);
router.delete('/clear', cartController.clearCart);

module.exports = router;
