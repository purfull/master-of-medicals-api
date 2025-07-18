const query = require("./model");
const fs = require("fs");
const { Op, literal } = require("sequelize");

const getAllQuery = async (req, res) => {
  try {
    const { title, author } = req.query;
    const whereClause = {};
    const andConditions = [];

    if (title) {
      whereClause.title = {
        [Op.like]: `%${title}%`,
      };
    }

    if (author) {
      whereClause.author = {
        [Op.like]: `%${author}%`,
      };
    }
    if (andConditions.length > 0) {
      whereClause[Op.and] = andConditions;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: querys } = await query.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });


    res.json({
      success: true,
      data: querys,
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
      message: "Failed to retrieve query",
    });
  }
};

const getQueryById = async (req, res) => {
  const { id } = req.params;

  try {

    const t = await query.findOne({ where: { id } });

    if (!t) {
      return res
        .status(404)
        .json({ success: false, message: "query not found" });
    }


    res.json({ success: true, data: t });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve query by id",
    });
  }
};

const createQuery = async (req, res) => {
  const { name, email, message  } = req.body;

  try {
    const newQuery = await query.create({
      name, email, message
    });

    res.json({
      success: true,
      message: "query created successfully",
      data: newQuery,
    });
  } catch (error) {
    console.error("Error creating query:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create query",
    });
  }
};

const updateQuery = async (req, res) => {
  const { id, name, email, message, remarks, status } = req.body;

  try {
    const existing = await query.findByPk(id);

    if (!existing) {
      return res.status(404).json({ message: "query not found" });
    }

    await query.update(
      {
        name, email, message, remarks, status
      },
      { where: { id } }
    );

    res.json({ success: true, message: "query updated successfully" });
  } catch (error) {
    console.error("Error updating query:", error);
    res.status(500).json({ success: false, message: "Failed to update query" });
  }
};

const deleteQuery = async (req, res) => {
  const { id } = req.params;

  try {
    const queryData = await query.findOne({ where: { id } });

    if (!queryData) {
      return res
        .status(404)
        .json({ success: false, message: "query not found" });
    }


    await query.destroy({ where: { id } });

    res.json({
      success: true,
      message: "query deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting query:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete query",
    });
  }
};

module.exports = {
  getAllQuery,
  getQueryById,
  createQuery,
  updateQuery,
  deleteQuery,
};
