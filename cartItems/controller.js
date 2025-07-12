const CartItems = require("../cartItems/model");
const Cart = require("../cart/model")
const Product = require('../product/model');

const getAllCartItems = async (req, res) => {
    
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await CartItems.findAndCountAll({
      limit,
      offset,
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });

  } catch (error) {
    console.error("Error getting cart items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cart items",
    });
  }
};

const getCartItemByCartId = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await Cart.findOne({where: {customerId: id}})
    const cartItems = await CartItems.findAll({
      where: { cartId: cart.id },
      include: [
        {
          model: Product,
          as: 'Product',
          attributes: ['id', 'name', 'price', 'description']
        }
      ]
    });

    if (!cartItems) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.json({ success: true, data: cartItems });

  } catch (error) {
    console.error("Error getting cart item by ID:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve cart item" });
  }
};

const createCartItem = async (req, res) => {
  const { cartId, productId, quantity } = req.body;

  try {
    const newItem = await CartItems.create({ cartId, productId, quantity });

    res.json({
      success: true,
      message: "Cart item added successfully",
      data: newItem,
    });

  } catch (error) {
    console.error("Error creating cart item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
};

const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const item = await CartItems.findByPk(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    await CartItems.update({ quantity }, { where: { id } });

    res.json({ success: true, message: "Cart item updated successfully" });

  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
    });
  }
};

const deleteCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await CartItems.findByPk(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    await CartItems.destroy({ where: { id } });

    res.json({
      success: true,
      message: "Cart item deleted successfully",
      data: item,
    });

  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete cart item",
    });
  }
};

module.exports = {
  getAllCartItems,
  getCartItemByCartId,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
