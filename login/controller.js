const customer = require("../customers/model");
const vendor = require("../vendors/model");
const bcrypt = require("bcryptjs");
// const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const login = async (req, res) => {
  const { type } = req.params; 
  const { email, password } = req.body;

  try {
    let model;
    if (type === "customer") model = customer;
    else if (type === "vendor") model = vendor;
    else return res.status(400).json({ message: "Invalid user type" });

    const existingUser = await model.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // const accessToken = generateAccessToken(existingUser);
    // const refreshToken = generateRefreshToken(existingUser);

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: false, 
    //   sameSite: "Strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.json({
      success: true,
      message: "Login successful",
    //   accessToken,
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