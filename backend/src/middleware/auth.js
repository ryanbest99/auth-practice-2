require("dotenv").config({ path: "./config.env" });
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  console.log(token);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);

  const user = await User.findOne({
    _id: decoded._id,
    "tokens.token": token,
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  req.user = user;
  req.token = token;

  next();
};

module.exports = auth;
