const bcrypt = require('bcryptjs');
const Customer = require("./model");


const getAllCustomer = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: Customers } = await Customer.findAndCountAll({
      limit,
      offset,
    });

    const updatedCustomers = Customers.map((t) => {
      return { ...t.toJSON() };
    });

    res.json({
      success: true,
      data: updatedCustomers,
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
      message: "Failed to retrieve Customers",
    });
  }
};


  const getCustomerById = async (req, res) => {
    const { id } = req.params;
  
    try {
  
      const t = await Customer.findOne({ where: { id } });
  
      if (!t) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
  
  
      res.json({ success: true, data: t });
  
    } catch (error) {
      console.log("error", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve Customer by id",
      });
    }
  };
  

const createCustomer = async (req, res) => {
  const { name, email, phone, password, address, city, state, country, postalCode } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = await Customer.create({
      name, email, phone, password: hashedPassword, address, city, state, country, postalCode
    });

    const payload = {
      id: newCustomer.id,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({
      success: true,
      accessToken,
      message: "Customer created successfully",
      data: newCustomer,
    });

  } catch (error) {
    console.error("Error creating Customer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Customer",
    });
  }
};

const updateCustomer = async (req, res) => {
    const { id, name, email, phone, address, city, state, country, postalCode } = req.body;
  
    try {
      const existing = await Customer.findByPk(id);
  
      if (!existing) {
        return res.status(404).json({ message: "Customer not found" });
      }
  
  
      await Customer.update(
        { name, email, phone, address, city, state, country, postalCode },
        { where: { id } }
      );
  
      res.json({ success: true, message: "Customer updated successfully" });
    } catch (error) {
      console.error("Error updating Customer:", error);
      res.status(500).json({ success: false, message: "Failed to update Customer" });
    }
};
  

const deleteCustomer = async (req, res) => {
    const { id } = req.params;
  
    try {
      const CustomerData = await Customer.findOne({ where: { id } });
  
      if (!CustomerData) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
  
      await Customer.update({isActive: false},{ where: { id } });
  
      res.json({
        success: true,
        message: "Customer deleted successfully",
      });
  
    } catch (error) {
      console.error("Error deleting Customer:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete Customer",
      });
    }
};
      
module.exports = {
    getAllCustomer,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
}