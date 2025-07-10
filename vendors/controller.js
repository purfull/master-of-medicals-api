const Vendors = require("./model");
const bcrypt = require('bcryptjs');
const path = require("path");
const fs = require("fs");
const { Op, literal } = require("sequelize");
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

const getAllVendors = async (req, res) => {
  try {
    const { name, state, type, status, email } = req.query;

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

    const { count, rows } = await Vendors.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });

    const updatedVendors = rows.map((vendor) => {
      const v = vendor.toJSON();
      if (v.files && Array.isArray(v.files)) {
        v.files = v.files.map((imgPath) => `${baseUrl}${imgPath}`);
      }
      return v;
    });

    res.json({
      success: true,
      data: updatedVendors,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vendors",
    });
  }
};


  const getVendorsById = async (req, res) => {
    const { id } = req.params;
  
    try {
  
      const baseUrl = `${req.protocol}://${req.get("host")}/`;
      const t = await Vendors.findOne({ where: { id } });
  
      if (!t) {
        return res.status(404).json({ success: false, message: "Vendors not found" });
      }
  
      const updatedFile = t.files?.map((imgPath) => `${baseUrl}${imgPath}`);
  
      res.json({ success: true, data: { ...t.toJSON(), files: updatedFile } });
  
    } catch (error) {
      console.log("error", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve Vendors by id",
      });
    }
  };
  

const createVendors = async (req, res) => {
  const { name, email, phone, password, address, city, state, country, postalCode, type } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const filePaths = req.files?.map((file) => `${process.env.FILE_PATH}${file.filename}`) || [];

    const newVendors = await Vendors.create({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      city,
      state,
      country,
      files: filePaths,
      postalCode,
      type,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}/`;
    const updatedImage = newVendors.files?.map((imgPath) => `${baseUrl}${imgPath}`);

    const updatedVendors = { ...newVendors.toJSON(), files: updatedImage };

    const payload = {
      id: newVendors.id,
      name: newVendors.name,
      email: newVendors.email,
      phone: newVendors.phone,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const isMobile = req.headers["platform"] === "mobile";
    if (!isMobile) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    res.json({
      success: true,
      accessToken,
      refreshToken: isMobile ? refreshToken : undefined,
      message: "Vendor created successfully",
      data: updatedVendors,
    });

  } catch (error) {
    console.error("Error creating Vendor:", error);
    res.status(500).json({ success: false, message: "Failed to create Vendor" });
  }
};


const updateVendors = async (req, res) => {
    const { id, name, email, phone, password, address, city, state, country, postalCode } = req.body;
  
    try {
      const existing = await Vendors.findByPk(id);
  
      if (!existing) {
        return res.status(404).json({ message: "Vendors not found" });
      }
  
  
      await Vendors.update(
        { name, email, phone, password, address, city, state, country, postalCode },
        { where: { id } }
      );
  
      res.json({ success: true, message: "Vendors updated successfully" });
    } catch (error) {
      console.error("Error updating Vendors:", error);
      res.status(500).json({ success: false, message: "Failed to update Vendors" });
    }
};
  

const deleteVendors = async (req, res) => {
    const { id } = req.params;
  
    try {
      const VendorsData = await Vendors.findOne({ where: { id } });
  
      if (!VendorsData) {
        return res.status(404).json({ success: false, message: "Vendors not found" });
      }
  
      await Vendors.update({status: "in-active"},{ where: { id } });
  
      res.json({
        success: true,
        message: "Vendors deleted successfully",
      });
  
    } catch (error) {
      console.error("Error deleting Vendors:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete Vendors",
      });
    }
};
      
module.exports = {
    getAllVendors,
    getVendorsById,
    createVendors,
    updateVendors,
    deleteVendors
}