const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const brand = require("./model"); 

const getAllBrand = async (req, res) => {
  try {
    const { type } = req.query;
    const whereClause = {};

    if (type) {
      whereClause.type = { [Op.like]: `%${type}%` };
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/`;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: brandData } = await brand.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]], 
      limit,
      offset,
    });

    const formatted = brandData.map((b) => ({
      ...b.toJSON(),
      brandImage: b.brandImage
        ? Array.isArray(b.brandImage)
          ? b.brandImage.map(img => baseUrl + img)
          : baseUrl + b.brandImage
        : null,
    }));

    res.json({
      success: true,
      data: formatted,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching brand:", err);
    res.status(500).json({ success: false, message: "Failed to retrieve brand" });
  }
};

const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const b = await brand.findByPk(id);
    if (!b) return res.status(404).json({ success: false, message: "Brand not found" });

    res.json({
      success: true,
      data: {
        ...b.toJSON(),
        brandImage: b.brandImage
          ? Array.isArray(b.brandImage)
            ? b.brandImage.map(img => baseUrl + img)
            : baseUrl + b.brandImage
          : null,
      },
    });
  } catch (err) {
    console.error("Error fetching Brand:", err);
    res.status(500).json({ success: false, message: "Failed to retrieve Brand" });
  }
};

const createBrand = async (req, res) => {
  try {
    const { name, type } = req.body;

    const brandImage = req.files?.brandImage?.[0]
      ? `${process.env.FILE_PATH}${req.files.brandImage[0].filename}`
      : null;

    const newBrand = await brand.create({
      name,
      type,
      brandImage,
    });

    res.json({
      success: true,
      message: "Brand created successfully",
      data: newBrand,
    });
  } catch (err) {
    console.error("Error creating Brand:", err);
    res.status(500).json({ success: false, message: "Failed to create Brand" });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { id, name, type, status } = req.body;

    const existing = await brand.findByPk(id);
    if (!existing) return res.status(404).json({ success: false, message: "Brand not found" });

    let brandImage = existing.brandImage;
    if (req.files?.brandImage?.[0]) {
      if (brandImage) {
        const oldPath = path.resolve(__dirname, "..", brandImage.replace(process.env.FILE_PATH, ""));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      brandImage = `${process.env.FILE_PATH}${req.files.brandImage[0].filename}`;
    }

    await existing.update(
      { name, status, type, brandImage },
      { where: { id } }
    );

    res.json({ success: true, message: "Brand updated successfully" });
  } catch (err) {
    console.error("Error updating Brand:", err);
    res.status(500).json({ success: false, message: "Failed to update Brand" });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const b = await brand.findByPk(id);
    if (!b) return res.status(404).json({ success: false, message: "Brand not found" });

    if (b.brandImage) {
      const fullPath = path.join(__dirname, "..", b.brandImage);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await brand.destroy({ where: { id } });

    res.json({ success: true, message: "Brand deleted successfully" });
  } catch (err) {
    console.error("Error deleting Brand:", err);
    res.status(500).json({ success: false, message: "Failed to delete Brand" });
  }
};

module.exports = {
  getAllBrand,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
