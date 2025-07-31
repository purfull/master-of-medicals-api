const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { Op, literal } = require("sequelize");
const Customer = require("./model");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const Cart = require("../cart/model");

const getAllCustomer = async (req, res) => {
  try {
    const { name, email, status, state, type, allCustomers } = req.query;

    const whereClause = {};
    const andConditions = [];
    if (allCustomers) {
      const result = await Customer.findAndCountAll({
        attributes: ["id", "name"],
      });
      return res.json(result);
    }
    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`,
      };
    }

    if (email) {
      whereClause.email = {
        [Op.like]: `%${email}%`,
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
      order: [["createdAt", "DESC"]],
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
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
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
  const {
    userName,
    name,
    email,
    phone,
    password,
    address,
    city,
    state,
    country,
    postalCode,
    type,
    additionalInformation,
  } = req.body;

  try {
    if (!password || password == "") {
      return res
        .status(401)
        .json({ success: false, message: "missing password" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const filePaths =
      req.files?.map((file) => `${process.env.FILE_PATH}${file.filename}`) ||
      [];
    // req.files?.map(file => path.relative("uploads", file.path).replace(/\\/g, "/"))
    const newCustomer = await Customer.create({
      userName,
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      city,
      state,
      country,
      postalCode,
      additionalInformation,
      files: filePaths,
      type,
    });
    const cart = await Cart.findOne({
      where: { customerId: newCustomer.id },
    });

    const payload = {
      id: newCustomer.id,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      cartId: cart?.id || null,
    };

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
  let {
    id,
    name,
    email,
    phone,
    address,
    city,
    state,
    country,
    postalCode,
    additionalInformation,
    remarks,
    status,
    oldFiles = [],
  } = req.body;

  try {
    console.log("typeof oldFiles", typeof oldFiles, oldFiles);

    if (typeof oldFiles === "string") {
      try {
        oldFiles = JSON.parse(oldFiles);
      } catch (err) {
        oldFiles = [];
      }
    }

    oldFiles = oldFiles.map((file) => {
      const uploadIndex = file.indexOf("uploads/");
      return uploadIndex !== -1 ? file.slice(uploadIndex) : file;
    });

    const existing = await Customer.findByPk(id);
    if (!existing) {
      return res.status(404).json({ message: "Customer not found" });
    }

    let filePaths = [...oldFiles];

    const removedFiles = (existing.files || []).filter(
      (file) => !oldFiles.includes(file)
    );

    for (const file of removedFiles) {
      const oldFilePath = path.join(__dirname, "..", file);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map(
        (file) => `${process.env.FILE_PATH}${file.filename}`
      );
      filePaths = [...filePaths, ...newFiles];
    }

    // if (typeof remarks === "string" && remarks.startsWith('"') && remarks.endsWith('"')) {
    //   try {
    //     remarks = JSON.parse(remarks);
    //   } catch (_) {}
    // }

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
        remarks,
        status,
        additionalInformation,
        files: filePaths,
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
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    await Customer.destroy({ where: { id } });

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
  deleteCustomer,
};
