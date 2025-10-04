const { Op } = require("sequelize");
const ProductReview = require("./model");
const Product = require("../product/model");
const Customer = require("../customers/model");

const getAllReviews = async (req, res) => {
  try {
    const { productId, customerId } = req.query;
    const where = {};

    if (productId) where.productId = productId;
    if (customerId) where.customerId = customerId;

    const reviews = await ProductReview.findAll({
      where,
      include: [
        { model: Product, attributes: ["id", "name"] },
        { model: Customer, attributes: ["id", "name"] },
      ],
    });

    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await ProductReview.findByPk(id, {
      include: [
        { model: Product, attributes: ["id", "name"] },
        { model: Customer, attributes: ["id", "name"] },
      ],
    });

    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    res.json({ success: true, data: review });
  } catch (err) {
    console.error("Error fetching review:", err);
    res.status(500).json({ success: false, message: "Failed to fetch review" });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, customerId, rating, comment } = req.body;

    const newReview = await ProductReview.create({
      productId,
      customerId,
      rating,
      comment,
    });

    res.json({ success: true, message: "Review added successfully", data: newReview });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ success: false, message: "Failed to add review" });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.body;
    const { rating, comment } = req.body;

    const review = await ProductReview.findByPk(id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    await review.update({ rating, comment });

    res.json({ success: true, message: "Review updated successfully" });
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ success: false, message: "Failed to update review" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await ProductReview.findByPk(id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    await review.destroy();

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
