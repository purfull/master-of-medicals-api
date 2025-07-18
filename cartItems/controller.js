const CartItems = require("../cartItems/model");
const Cart = require("../cart/model");
const Product = require("../product/model");

const getAllCartItems = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await CartItems.findAndCountAll({
      include: [
        {
          model: Product,
          as: "Product",
          attributes: ["id", "name", "price", "description", "thumbnailImage"],
        },
      ],
      limit,
      offset,
    });

    const updatedRows = rows.map((item) => {
      const cartItem = item.toJSON();

      if (cartItem.Product && cartItem.Product.thumbnailImage) {
        cartItem.Product.thumbnailImage =
          cartItem.Product.thumbnailImage.startsWith("http")
            ? cartItem.Product.thumbnailImage
            : `${baseUrl}${cartItem.Product.thumbnailImage}`;
      }

      return cartItem;
    });

    res.json({
      success: true,
      data: updatedRows,
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
    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const cart = await Cart.findOne({ where: { customerId: id } });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const cartItems = await CartItems.findAll({
      where: { cartId: cart.id },
      include: [
        {
          model: Product,
          as: "Product",
          attributes: [
            "id",
            "name",
            "price",
            "description",
            "galleryImage",
            "thumbnailImage",
          ],
        },
      ],
    });

    // if (!cartItems || cartItems.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Cart items not found" });
    // }

    const updatedCartItems = cartItems?.map((cartItem) => {
      const item = cartItem.toJSON();

      if (item.Product) {
        item.Product.thumbnailImage = `${baseUrl}${item.Product.thumbnailImage}`;

        item.Product.galleryImage = Array.isArray(item.Product.galleryImage)
          ? item.Product.galleryImage.map((img) =>
              img.trim().startsWith("http")
                ? img.trim()
                : `${baseUrl}${img.trim()}`
            )
          : [];
      }

      return item;
    });

    res.json({ success: true, data: updatedCartItems });
  } catch (error) {
    console.error("Error getting cart item by ID:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve cart item" });
  }
};

const createCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const cartId = req.user.cartId;
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
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
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
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
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
