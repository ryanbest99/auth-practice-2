const express = require("express");
const router = express.Router();
const {
  signUp,
  register,
  accountActivation,
  login,
  users,
} = require("../controllers/auth");

router.route("/signup").post(signUp);
router.route("/register").post(register);
router.route("/account-activation").post(accountActivation);
router.route("/login").post(login);
router.route("/users").get(users);

module.exports = router;
