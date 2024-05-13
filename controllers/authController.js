const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// login and register
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
// update user
const updateUser = async (req, res) => {
  const { email, displayName, photoURL } = req.body;
  try {
    let user;
    if (email) {
      user = await User.findOne({ email });
    }
    if(!user) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "User not found" });
    if (user) {
      user = await User.findOneAndUpdate(
        { email },
        { displayName, photoURL },
        { new: true }
      );
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "user data updated", user });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

// check if user is logged in
const isLogin = (req, res) => {
  res.status(200).json({ success: true, message: "User is logged in" });
};

// logout user and clear cookie
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

module.exports = { fireAuth,updateUser, logout, isLogin };
