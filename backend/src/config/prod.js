require("dotenv").config({ path: "./config.env" });

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
};
