const bcrypt = require('bcryptjs');
const path = require("path");
const fs = require("fs");
const { Op, literal } = require("sequelize");
const Customer = require("./model");
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const Cart = require('../cart/model');


const getAllCustomer = async (req, res) => {
  try {
    const { name, email, status, state, type } = req.query;

    const whereClause = {};
    const andConditions = [];

      if (name) {
        whereClause.name = {
  [Op.like]: `%${name}%`
};
      }
  
      if (email) {
  whereClause.email = {
    [Op.like]: `%${email}%`
  };
}

    if (status) whereClause.status = status;
    if (type) whereClause.type = type;
    if (state) whereClause.state = state;

    if (andConditions.length > 0) {
      whereClause[Op.and] = andConditions;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const { count, rows } = await Customer.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });

    const updatedCustomers = rows.map((customer) => {
      const c = customer.toJSON();
      if (c.files && Array.isArray(c.files)) {
        c.files = c.files.map((imgPath) => `${baseUrl}${imgPath}`);
      }
      return c;
    });

    res.json({
      success: true,
      data: updatedCustomers,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });

  } catch (error) {
    console.error("Error retrieving customers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve customers",
    });
  }
};


  const getCustomerById = async (req, res) => {
    const { id } = req.params;
  
    try {
  
      const baseUrl = `${req.protocol}://${req.get("host")}/`;
      const t = await Customer.findOne({ where: { id } });
  
      if (!t) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
  
      const updatedImage = t.files?.map((imgPath) => `${baseUrl}${imgPath}`);
  
      res.json({ success: true, data: { ...t.toJSON(), files: updatedImage } });
  
    } catch (error) {
      console.log("error", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve Customer by id",
      });
    }
  };
  

const createCustomer = async (req, res) => {
  const { name, email, phone, password, address, city, state, country, postalCode, type } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);
    const filePaths = req.files?.map((file) => `${process.env.FILE_PATH}${file.filename}`) || [];
    // req.files?.map(file => path.relative("uploads", file.path).replace(/\\/g, "/")) 
    const newCustomer = await Customer.create({
      name, email, phone, password: hashedPassword, address, city, state, country, postalCode, files: filePaths, type
    });
    const cart = await Cart.findOne({
      where: { customerId: newCustomer.id }
    });

    const payload = {
      id: newCustomer.id,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      cartId: cart?.id || null,
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({
      success: true,
      accessToken,
      message: "Customer created successfully",
      data: newCustomer,
    });

  } catch (error) {
    console.error("Error creating Customer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Customer",
    });
  }
};

const updateCustomer = async (req, res) => {
  const { id, name, email, phone, address, city, state, country, postalCode } = req.body;

  try {
    const existing = await Customer.findByPk(id);

    if (!existing) {
      return res.status(404).json({ message: "Customer not found" });
    }

    let filePaths = existing.files || [];

    if (req.files && req.files.length > 0) {
      for (const filePath of filePaths) {
        const oldFilePath = path.join(__dirname, "..", filePath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      filePaths = req.files.map(file => `${process.env.FILE_PATH}${file.filename}`);
    }

    await Customer.update(
      {
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        postalCode,
        files: filePaths
      },
      { where: { id } }
    );

    res.json({ success: true, message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error updating Customer:", error);
    res.status(500).json({ success: false, message: "Failed to update Customer" });
  }
};

  

const deleteCustomer = async (req, res) => {
    const { id } = req.params;
  
    try {
      const CustomerData = await Customer.findOne({ where: { id } });
  
      if (!CustomerData) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
  
      await Customer.update({status: "in-active"},{ where: { id } });
  
      res.json({
        success: true,
        message: "Customer deleted successfully",
      });
  
    } catch (error) {
      console.error("Error deleting Customer:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete Customer",
      });
    }
};
      
module.exports = {
    getAllCustomer,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
}