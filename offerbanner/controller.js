const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const offerBanner = require("./model"); 

const getAllOfferBanners = async (req, res) => {
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

    const { count, rows: banners } = await offerBanner.findAndCountAll({
      where: whereClause,
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

const getOfferBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const b = await offerBanner.findByPk(id);
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

const createOfferBanner = async (req, res) => {
  try {
    const { ctaText, ctaLink } = req.body;

    const bannerImage = req.files?.bannerImage?.[0]
      ? `${process.env.FILE_PATH}${req.files.bannerImage[0].filename}`
      : null;

    const newBanner = await offerBanner.create({
      ctaText,
      ctaLink,
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

const updateOfferBanner = async (req, res) => {
  try {
    const { id, ctaText, ctaLink, isActive } = req.body;

    const existing = await offerBanner.findByPk(id);
    if (!existing) return res.status(404).json({ success: false, message: "Banner not found" });

    let bannerImage = existing.bannerImage;
    if (req.files?.bannerImage?.[0]) {
      if (bannerImage) {
        const oldPath = path.join(__dirname, "..", bannerImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      bannerImage = `${process.env.FILE_PATH}${req.files.bannerImage[0].filename}`;
    }

    await offerBanner.update(
      { ctaText, ctaLink, isActive, bannerImage },
      { where: { id } }
    );

    res.json({ success: true, message: "Banner updated successfully" });
  } catch (err) {
    console.error("Error updating banner:", err);
    res.status(500).json({ success: false, message: "Failed to update banner" });
  }
};

const deleteOfferBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const b = await offerBanner.findByPk(id);
    if (!b) return res.status(404).json({ success: false, message: "Banner not found" });

    if (b.bannerImage) {
      const fullPath = path.join(__dirname, "..", b.bannerImage);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await offerBanner.destroy({ where: { id } });

    res.json({ success: true, message: "Banner deleted successfully" });
  } catch (err) {
    console.error("Error deleting banner:", err);
    res.status(500).json({ success: false, message: "Failed to delete banner" });
  }
};

module.exports = {
  getAllOfferBanners,
  getOfferBannerById,
  createOfferBanner,
  updateOfferBanner,
  deleteOfferBanner,
};
