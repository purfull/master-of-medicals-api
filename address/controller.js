const { Op } = require("sequelize");
const Address = require("./model"); 
const Customer = require("../customers/model");

const getAllAddresses = async (req, res) => {
  try {
    const { city, state, country, customerId } = req.query;

    const whereClause = {};

    if (city) whereClause.city = { [Op.like]: `%${city}%` };
    if (state) whereClause.state = { [Op.like]: `%${state}%` };
    if (country) whereClause.country = { [Op.like]: `%${country}%` };
    if (customerId) whereClause.customerId = customerId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Address.findAndCountAll({
      where: whereClause,
      include: [{ model: Customer, attributes: ["id", "name", "email"] }],
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
    console.error("Error retrieving addresses:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve addresses" });
  }
};

const getAddressById = async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findOne({
      where: { id },
      include: [{ model: Customer, attributes: ["id", "name", "email"] }]
    });

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, data: address });
  } catch (error) {
    console.error("Error retrieving address:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve address" });
  }
};


const createAddress = async (req, res) => {
  const { customerId, address, city, state, country, postalCode } = req.body;

  try {
    const customerExists = await Customer.findByPk(customerId);
    if (!customerExists) {
      return res.status(400).json({ success: false, message: "Customer does not exist" });
    }

    const newAddress = await Address.create({
      customerId,
      address,
      city,
      state,
      country,
      postalCode,
    });

    res.json({
      success: true,
      message: "Address created successfully",
      data: newAddress,
    });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ success: false, message: "Failed to create address" });
  }
};


const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { address, city, state, country, postalCode } = req.body;

  try {
    const existing = await Address.findByPk(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    await Address.update(
      { address, city, state, country, postalCode },
      { where: { id } }
    );

    res.json({ success: true, message: "Address updated successfully" });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ success: false, message: "Failed to update address" });
  }
};


const deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Address.findByPk(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    await Address.destroy({ where: { id } });

    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ success: false, message: "Failed to delete address" });
  }
};

module.exports = {
  getAllAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
