const Vendors = require("./model");
const bcrypt = require('bcryptjs');


const getAllVendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: Vendorss } = await Vendors.findAndCountAll({
      limit,
      offset,
    });

    const updatedVendorss = Vendorss.map((t) => {
      return { ...t.toJSON() };
    });

    res.json({
      success: true,
      data: updatedVendorss,
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
      message: "Failed to retrieve Vendorss",
    });
  }
};


  const getVendorsById = async (req, res) => {
    const { id } = req.params;
  
    try {
  
      const t = await Vendors.findOne({ where: { id } });
  
      if (!t) {
        return res.status(404).json({ success: false, message: "Vendors not found" });
      }
  
  
      res.json({ success: true, data: t });
  
    } catch (error) {
      console.log("error", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve Vendors by id",
      });
    }
  };
  

const createVendors = async (req, res) => {
  const { name, email, phone, password, address, city, state, country, postalCode } = req.body;

  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendors = await Vendors.create({
      name, email, phone, hashedPassword, address, city, state, country, postalCode
    });

    res.json({
      success: true,
      message: "Vendors created successfully",
      data: newVendors,
    });

  } catch (error) {
    console.error("Error creating Vendors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Vendors",
    });
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
  
      await Vendors.update({isActive: false},{ where: { id } });
  
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