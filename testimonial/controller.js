const testimonial = require("./model");
const path = require("path");
const fs = require("fs");
const { Op, literal } = require("sequelize");

const getAllTestimonial = async (req, res) => {
  try {
    const { name, designation } = req.query;
    const whereClause = {};
    const andConditions = [];

    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`,
      };
    }

    if (designation) {
      whereClause.designation = {
        [Op.like]: `%${designation}%`,
      };
    }
    if (andConditions.length > 0) {
      whereClause[Op.and] = andConditions;
    }
    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: testimonials } = await testimonial.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]], 
      limit,
      offset,
    });

    const updatedTestimonials = testimonials.map((t) => {
      const updatedImage = t.image?.map((imgPath) => `${baseUrl}${imgPath}`);
      return { ...t.toJSON(), image: updatedImage };
    });

    res.json({
      success: true,
      data: updatedTestimonials,
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
      message: "Failed to retrieve testimonials",
    });
  }
};

const getTestimonialById = async (req, res) => {
  const { id } = req.params;

  try {
    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const t = await testimonial.findOne({ where: { id } });

    if (!t) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    const updatedImage = t.image?.map((imgPath) => `${baseUrl}${imgPath}`);

    res.json({ success: true, data: { ...t.toJSON(), image: updatedImage } });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve testimonial by id",
    });
  }
};

const createTestimonial = async (req, res) => {
  const { name, message, designation } = req.body;

  const imagePaths = req.file
    ? [`${process.env.FILE_PATH}${req.file.filename}`]
    : [];

  try {
    const newTestimonial = await testimonial.create({
      name,
      image: imagePaths,
      message,
      designation,
    });

    res.json({
      success: true,
      message: "Testimonial created successfully",
      data: newTestimonial,
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create testimonial",
    });
  }
};

const updateTestimonial = async (req, res) => {
  const { id, name, message, designation, isActive } = req.body;

  try {
    const existing = await testimonial.findByPk(id);

    if (!existing) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    let imagePaths = existing.image || [];

    if (req.file) {
      if (imagePaths.length > 0) {
        const oldImagePath = path.join(__dirname, "..", imagePaths[0]);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      imagePaths = [`${process.env.FILE_PATH}${req.file.filename}`];
    }

    await testimonial.update(
      {
        name,
        message,
        designation,
        isActive,
        image: imagePaths
      },
      { where: { id } }
    );

    res.json({ success: true, message: "Testimonial updated successfully" });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).json({ success: false, message: "Failed to update testimonial" });
  }
};

const deleteTestimonial = async (req, res) => {
  const { id } = req.params;

  try {
    const testimonialData = await testimonial.findOne({ where: { id } });

    if (!testimonialData) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    if (Array.isArray(testimonialData.image)) {
      testimonialData.image.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "..", imgPath);
        fs.unlink(fullPath, (err) => {
          if (err) console.error(`Failed to delete file: ${fullPath}`, err);
        });
      });
    }

    const deletedRecord = { ...testimonialData.get() };

    await testimonial.destroy({ where: { id } });

    res.json({
      success: true,
      message: "Testimonial deleted successfully",
      data: deletedRecord,
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
    });
  }
};

module.exports = {
  getAllTestimonial,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
