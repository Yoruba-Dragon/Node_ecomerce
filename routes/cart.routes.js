const express = require('express');
const cartController = require('../controllers/carts.controllers');
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

router.post('/add', protect, cartController.addToCart);
router.get('/', protect, cartController.getCart);
router.delete('/remove/:id',protect, cartController.removeItem);
router.delete('/clear',protect, cartController.clearCart);

module.exports = router;
