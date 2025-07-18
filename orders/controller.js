const Orders = require("./model");

const getAllOrders = async (req, res) => {
  try {
    
    const { status } = req.query;

    const whereClause = {};

    if (status) whereClause.status = status;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Orders.findAndCountAll({ where: whereClause, limit, offset });

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
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
    });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Orders.findByPk(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve order" });
  }
};

const createOrder = async (req, res) => {
  const { customerInfo, productInfo, subTotal, gstAmount, totalCost, status } = req.body;

  try {
    const newOrder = await Orders.create({
      customerInfo,
      productInfo,
      subTotal,
      gstAmount,
      totalCost,
      status,
    });

    res.json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { customerInfo, productInfo, subTotal, gstAmount, totalCost, status } = req.body;

  try {
    const order = await Orders.findByPk(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await Orders.update(
      { customerInfo, productInfo, subTotal, gstAmount, totalCost, status },
      { where: { id } }
    );

    res.json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Orders.findByPk(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await Orders.destroy({ where: { id } });

    res.json({
      success: true,
      message: "Order deleted successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
