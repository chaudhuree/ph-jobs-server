const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const fireAuth = async (req, res) => {
  const { email, displayName, photoURL } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .status(StatusCodes.OK)
        .json({ success: true, user, token });
    } else {
      user = await User.create({ email, displayName, photoURL });
      const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .status(StatusCodes.CREATED)
        .json({ user, token });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

const isLogin = (req, res) => {
  res.status(200).json({ success: true, message: "User is logged in" });
};

const logout = async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 0,
    })
    .status(StatusCodes.OK)
    .json({ success: true, message: "Logged out" });
};

module.exports = { fireAuth, logout, isLogin };
