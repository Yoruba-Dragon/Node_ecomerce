const Order = require('../models/orders.models');
const Product = require('../models/products.models');
const Cart = require('../models/cart.models');


exports.createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Your cart is empty" });
    }

    for (let item of cart.items) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          error: `Only ${item.product.stock} of ${item.product.name} available`
        });
      }
    }


    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const newOrder = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalPrice,
      status: "pending"
    });

   
    for (let item of cart.items) {
      const product = await Product.findById(item.product._id);
      product.stock -= item.quantity;
      await product.save();
    }

    
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.status(200).json({ orders });
  } catch (err) {
    console.error("Get My Orders Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "shipped", "delivered", "canceled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.error("Update Order Status Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").populate("items.product");
    res.status(200).json({ orders });
  } catch (err) {
    console.error("Get All Orders Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
