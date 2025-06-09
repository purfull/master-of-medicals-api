const blog = require("./model");
const path = require("path");
const fs = require("fs");


const getAllBlog = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: blogs } = await blog.findAndCountAll({
      limit,
      offset,
    });

    const updatedBlogs = blogs.map((t) => {
      const updatedImage = t.image?.map((imgPath) => `${baseUrl}${imgPath}`);
      return { ...t.toJSON(), image: updatedImage };
    });

    res.json({
      success: true,
      data: updatedBlogs,
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
      message: "Failed to retrieve blogs",
    });
  }
};


  const getBlogById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const baseUrl = `${req.protocol}://${req.get("host")}/`;
  
      const t = await blog.findOne({ where: { id } });
  
      if (!t) {
        return res.status(404).json({ success: false, message: "blog not found" });
      }
  
      const updatedImage = t.image?.map((imgPath) => `${baseUrl}${imgPath}`);
  
      res.json({ success: true, data: { ...t.toJSON(), image: updatedImage } });
  
    } catch (error) {
      console.log("error", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve blog by id",
      });
    }
  };
  

const createBlog = async (req, res) => {
  const { content, metaTitle, metaDescription, title, author } = req.body;

  const imagePaths = req.file ? [`${process.env.FILE_PATH}${req.file.filename}`] : [];

  try {
    const newBlog = await blog.create({
      content,
      image: imagePaths, 
      title,
      author,
      metaTitle, 
      metaDescription
    });

    res.json({
      success: true,
      message: "blog created successfully",
      data: newBlog,
    });

  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
    });
  }
};

const updateBlog = async (req, res) => {
    const { id, content, metaTitle, metaDescription, title, author, isActive } = req.body;
  
    try {
      const existing = await blog.findByPk(id);
  
      if (!existing) {
        return res.status(404).json({ message: "blog not found" });
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
  
      await blog.update(
        { content, image: imagePaths, metaTitle, metaDescription, title, author, isActive },
        { where: { id } }
      );
  
      res.json({ success: true, message: "blog updated successfully" });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ success: false, message: "Failed to update blog" });
    }
};
  

const deleteBlog = async (req, res) => {
    const { id } = req.params;
  
    try {
      const blogData = await blog.findOne({ where: { id } });
  
      if (!blogData) {
        return res.status(404).json({ success: false, message: "blog not found" });
      }
  
      if (Array.isArray(blogData.image)) {
        blogData.image.forEach((imgPath) => {
          const fullPath = path.join(__dirname, '..', imgPath);
          fs.unlink(fullPath, (err) => {
            if (err) console.error(`Failed to delete file: ${fullPath}`, err);
          });
        });
      }
  
      await blog.destroy({ where: { id } });
  
      res.json({
        success: true,
        message: "blog deleted successfully",
      });
  
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete blog",
      });
    }
};
      
module.exports = {
    getAllBlog,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
}