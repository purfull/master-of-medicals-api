const customer = require("../customers/model");
const vendor = require("../vendors/model");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const Cart = require('../cart/model');

const login = async (req, res) => {
  const { type } = req.params; 
  const { email, password, token } = req.body;
  const isMobile = req.headers['platform'] === 'mobile';
  try {
    let model;
    if (type === "customer") model = customer;
    else if (type === "vendor") model = vendor;
    else return res.status(400).json({ message: "Invalid user type" });


    const existingUser = await model.findOne({ where: { email } });

     let cart
    if (type === "customer") {
      
      cart = await Cart.findOne({ where: { customerId: existingUser.id } });
    }

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    
    const payload = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      phone: existingUser.phone,
      ...(type === "customer" && { cartId: cart?.id }),
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    if (!isMobile) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, 
        sameSite: "Strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken: isMobile ? refreshToken : null,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        type,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};


  
      
module.exports = {
    login
}