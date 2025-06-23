const Product = require("./model");
const path = require("path");
const fs = require("fs");
const { Op, fn, col, where, literal} = require('sequelize');


const getAllProduct = async (req, res) => {
  try {
     const { name, category, status, userId } = req.query;

      const whereClause = {};

      if (name) {
        whereClause[Op.and] = literal(`LOWER(JSON_UNQUOTE(name->'$.en')) LIKE '%${name.toLowerCase()}%'`);
      }

      if (category) {
          whereClause.category = category;
      }

      if (status) {
          whereClause.status = status;
      }
      if (userId) {
        whereClause.postedBy = userId;
      }

    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'galleryImage', 'additionalInformation'], 
      },
      where: whereClause,
    });

    const updatedProducts = products.map((t) => {
      const updatedThumbImage = t.thumbnailImage?.map((imgPath) => `${baseUrl}${imgPath}`);
      // const updatedGalleryImage = t.image?.map((imgPath) => `${baseUrl}${imgPath}`);
      return { ...t.toJSON(), image: updatedThumbImage };
    });

    res.json({
      success: true,
      data: updatedProducts,
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
      message: "Failed to retrieve Products",
    });
  }
};


  const getProductById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const baseUrl = `${req.protocol}://${req.get("host")}/`;
  
      const t = await Product.findOne({ where: { id },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'thumbnailImage', 'additionalInformation'], 
      } });
  
      if (!t) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
    const updatedProducts = t.map((t) => {
      // const updatedThumbImage = t.thumbnailImage?.map((imgPath) => `${baseUrl}${imgPath}`);
      const updatedGalleryImage = t.galleryImage?.map((imgPath) => `${baseUrl}${imgPath}`);
      return { ...t.toJSON(), images: updatedGalleryImage };
    });
  
      res.json({ success: true, data: updatedProducts });
  
    } catch (error) {
      console.log("error", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve Product by id",
      });
    }
  };
  

const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    postedBy,
    priceLable,
    brandName,
    benefits,
    expiresOn,
    additionalInformation,
  } = req.body;

  try {
    const thumbnailImage = req.files?.thumbnailImage?.[0]
      ? `${process.env.FILE_PATH}${req.files.thumbnailImage[0].filename}`
      : null;

    const galleryImage = req.files?.galleryImage
      ? req.files.galleryImage.map((file) => `${process.env.FILE_PATH}${file.filename}`)
      : [];

    const newProduct = await Product.create({
      name,
      description,
      thumbnailImage,
      galleryImage,
      price,
      postedBy,
      priceLable,
      brandName,
      benefits,
      expiresOn,
      additionalInformation,
    });

    res.json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error creating Product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Product",
    });
  }
};


const updateProduct = async (req, res) => {
    const { id, content, metaTitle, metaDescription, title, author, isActive } = req.body;
  
    try {
      const existing = await Product.findByPk(id);
  
      if (!existing) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      let imagePaths = existing.image; 
  
      if (req.file) {
        if (imagePaths && imagePaths.length > 0) {
          const oldImagePath = path.join(__dirname, "..", imagePaths[0]);
          
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
  
        imagePaths = [`${process.env.FILE_PATH}${req.file.filename}`];
      }
  
      await Product.update(
        { content, image: imagePaths, metaTitle, metaDescription, title, author, isActive },
        { where: { id } }
      );
  
      res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
      console.error("Error updating Product:", error);
      res.status(500).json({ success: false, message: "Failed to update Product" });
    }
};
  

const deleteProduct = async (req, res) => {
    const { id } = req.params;
  
    try {
      const ProductData = await Product.findOne({ where: { id } });
  
      if (!ProductData) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      if (Array.isArray(ProductData.image)) {
        ProductData.image.forEach((imgPath) => {
          const fullPath = path.join(__dirname, '..', imgPath);
          fs.unlink(fullPath, (err) => {
            if (err) console.error(`Failed to delete file: ${fullPath}`, err);
          });
        });
      }
  
      await Product.destroy({ where: { id } });
  
      res.json({
        success: true,
        message: "Product deleted successfully",
      });
  
    } catch (error) {
      console.error("Error deleting Product:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete Product",
      });
    }
};
      
module.exports = {
    getAllProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}