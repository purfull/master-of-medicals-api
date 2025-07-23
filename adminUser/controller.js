const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { Op, literal } = require("sequelize");
const AdminUser = require("./model");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const { profile } = require("console");

const getAllAdminUser = async (req, res) => {
  try {
    const { name, state, role, status, email } = req.query;
    const whereClause = {};
    const andConditions = [];

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
    if (state) whereClause.state = state;
    if (role) whereClause.role = role;

    if (andConditions.length > 0) {
      whereClause[Op.and] = andConditions;
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const { count, rows: admin } = await AdminUser.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]], 
      limit,
      offset,
    });

    const updatedAdmin = admin.map((t) => {
      const profile = t.profile;

      let updatedImage = [];
      if (Array.isArray(profile)) {
        updatedImage = profile.map((imgPath) => `${baseUrl}${imgPath}`);
      } else if (typeof profile === "string") {
        updatedImage = [`${baseUrl}${profile}`];
      }

      return { ...t.toJSON(), profile: updatedImage };
    });

    res.json({
      success: true,
      data: updatedAdmin,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve Admin users",
    });
  }
};

const getAdminUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const baseUrl = `${req.protocol}://${req.get("host")}/`;
    const t = await AdminUser.findOne({ where: { id } });

    if (!t) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    const profile = t.profile;

    let updatedImage = [];
    if (Array.isArray(profile)) {
      updatedImage = profile.map((imgPath) => `${baseUrl}${imgPath}`);
    } else if (typeof profile === "string") {
      updatedImage = [`${baseUrl}${profile}`];
    }

    res.json({
      success: true,
      data: { ...t.toJSON(), profile: updatedImage },
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve Admin by id",
    });
  }
};

const createAdminUser = async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    address,
    city,
    state,
    country,
    postalCode,
    role,
    status,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const filePaths =
      req.files?.map((file) => `${process.env.FILE_PATH}${file.filename}`) ||
      [];
    // const filePaths = req.file ? `${process.env.FILE_PATH}${req.file.filename}` : null;
    const newAdmin = await AdminUser.create({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      city,
      state,
      country,
      postalCode,
      profile: filePaths,
      role,
      status,
    });

    // const payload = {
    //   id: newCustomer.id,
    //   name: newCustomer.name,
    //   email: newCustomer.email,
    //   phone: newCustomer.phone,
    // }

    // const accessToken = generateAccessToken(payload);
    // const refreshToken = generateRefreshToken(payload);

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "Strict",
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    // });
    res.json({
      success: true,
      // accessToken,
      message: "Admin created successfully",
      data: newAdmin,
    });
  } catch (error) {
    console.error("Error creating Admin:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Admin",
    });
  }
};

const updateAdminUser = async (req, res) => {
  const {
    id,
    name,
    email,
    phone,
    address,
    city,
    state,
    country,
    postalCode,
    role,
    status,
  } = req.body;

  try {
    const existing = await AdminUser.findByPk(id);

    if (!existing) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let imagePaths = existing.profile;

    if (req.files && req.files.length > 0) {
      if (imagePaths && imagePaths.length > 0) {
        const oldImagePath = path.join(__dirname, "..", imagePaths[0]);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      imagePaths = req.files.map(
        (file) => `${process.env.FILE_PATH}${file.filename}`
      );
    }

    await AdminUser.update(
      {
        name,
        email,
        phone,
        profile: imagePaths,
        address,
        city,
        state,
        country,
        postalCode,
        role,
        status,
      },
      { where: { id } }
    );

    res.json({ success: true, message: "Admin updated successfully" });
  } catch (error) {
    console.error("Error updating Admin:", error);
    res.status(500).json({ success: false, message: "Failed to update Admin" });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const isMobile = req.headers["platform"] === "mobile";
  try {
    const existingUser = await AdminUser.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/`;
    updatedImage = existingUser.profile?.map(
      (imgPath) => `${baseUrl}${imgPath}`
    );

    const payload = {
      id: existingUser.id,
      name: existingUser.name,
      role: existingUser.role,
      menu: ["customer", "vendor", "blog", "testimonial", "support-query"],
      profile: updatedImage,
      email: existingUser.email,
      phone: existingUser.phone,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

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
      message: "Login successful",
      accessToken,
      refreshToken: isMobile ? refreshToken : null,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

const deleteAdminUser = async (req, res) => {
  const { id } = req.params;

  try {
    const adminData = await AdminUser.findOne({ where: { id } });

    if (!adminData) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    await AdminUser.update({ isActive: false }, { where: { id } });

    res.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Admin:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete Admin",
    });
  }
};

module.exports = {
  getAllAdminUser,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  adminLogin,
  deleteAdminUser,
};
