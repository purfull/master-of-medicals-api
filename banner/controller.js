const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const banner = require("./model"); 

const getAllBanners = async (req, res) => {
  try {
    const { title, type } = req.query;
    const whereClause = {};

    if (title) {
      whereClause.title = { [Op.like]: `%${title}%` };
    }
    if (type) {
      whereClause.type = { [Op.like]: `%${type}%` };
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/`;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: banners } = await banner.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]], 
      limit,
      offset,
    });

    const formatted = banners.map((b) => ({
      ...b.toJSON(),
      bannerImage: b.bannerImage
        ? Array.isArray(b.bannerImage)
          ? b.bannerImage.map(img => baseUrl + img)
          : baseUrl + b.bannerImage
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
    console.error("Error fetching banners:", err);
    res.status(500).json({ success: false, message: "Failed to retrieve banners" });
  }
};

const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const b = await banner.findByPk(id);
    if (!b) return res.status(404).json({ success: false, message: "Banner not found" });

    res.json({
      success: true,
      data: {
        ...b.toJSON(),
        bannerImage: b.bannerImage
          ? Array.isArray(b.bannerImage)
            ? b.bannerImage.map(img => baseUrl + img)
            : baseUrl + b.bannerImage
          : null,
      },
    });
  } catch (err) {
    console.error("Error fetching banner:", err);
    res.status(500).json({ success: false, message: "Failed to retrieve banner" });
  }
};

const createBanner = async (req, res) => {
  try {
    const { title, description, ctaText, ctaLink, type } = req.body;

    const bannerImage = req.files?.bannerImage?.[0]
      ? `${process.env.FILE_PATH}${req.files.bannerImage[0].filename}`
      : null;

    const newBanner = await banner.create({
      title,
      description,
      ctaText,
      ctaLink,
      type,
      bannerImage,
    });

    res.json({
      success: true,
      message: "Banner created successfully",
      data: newBanner,
    });
  } catch (err) {
    console.error("Error creating banner:", err);
    res.status(500).json({ success: false, message: "Failed to create banner" });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id, title, description, ctaText, ctaLink, type, isActive } = req.body;

    const existing = await banner.findByPk(id);
    if (!existing) return res.status(404).json({ success: false, message: "Banner not found" });

    let bannerImage = existing.bannerImage;
    if (req.files?.bannerImage?.[0]) {
      if (bannerImage) {
        const oldPath = path.join(__dirname, "..", bannerImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      bannerImage = `${process.env.FILE_PATH}${req.files.bannerImage[0].filename}`;
    }

    await banner.update(
      { title, description, ctaText, ctaLink, type, isActive, bannerImage },
      { where: { id } }
    );

    res.json({ success: true, message: "Banner updated successfully" });
  } catch (err) {
    console.error("Error updating banner:", err);
    res.status(500).json({ success: false, message: "Failed to update banner" });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const b = await banner.findByPk(id);
    if (!b) return res.status(404).json({ success: false, message: "Banner not found" });

    if (b.bannerImage) {
      const fullPath = path.join(__dirname, "..", b.bannerImage);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await banner.destroy({ where: { id } });

    res.json({ success: true, message: "Banner deleted successfully" });
  } catch (err) {
    console.error("Error deleting banner:", err);
    res.status(500).json({ success: false, message: "Failed to delete banner" });
  }
};

module.exports = {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
};
