const Carts = require('../models/cart.models');
const Product = require('../models/products.models');

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { productName, quantity } = req.body;
    if (!req.user) return res.status(401).json({ error: "You must be logged in" });

    const product = await Product.findOne({ name: productName });
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (quantity > product.stock) {
      return res.status(400).json({ error: `Only ${product.stock} of ${productName} available in stock` });
    }

    const userId = req.user._id;
    let cart = await Carts.findOne({ user: userId });
    if (!cart) cart = new Carts({ user: userId, items: [] });

    const existingItem = cart.items.find(item => item.product.toString() === product._id.toString());
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: product._id, quantity });
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart successfully', cart });

  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get cart for current user
exports.getCart = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "You must be logged in" });

    const cart = await Carts.findOne({ user: req.user._id }).populate('items.product', 'productName price image');
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: 'Cart is empty', cart: [] });
    }

    res.status(200).json({ message: 'Cart retrieved successfully', cart });

  } catch (error) {
    console.error('Error retrieving cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove single item from cart by product ID
exports.removeItem = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "You must be logged in" });

    const productId = req.params.id;
    const cart = await Carts.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart successfully", cart });

  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Clear all items from cart
exports.clearCart = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "You must be logged in" });

    const cart = await Carts.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully", cart });

  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
