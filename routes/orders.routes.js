const express =require ('express');
const {createOrder, getMyOrders, updateOrderStatus} = require('../controllers/orders.controllers');
const {protect, restrictTo} = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.put('/:orderId', protect, restrictTo('admin'), updateOrderStatus);

module.exports = router;