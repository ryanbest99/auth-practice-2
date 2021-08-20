const express = require("express");
const router = express.Router();
const { register, accountActivation, login } = require("../controllers/auth");

router.route("/register").post(register);
router.route("/account-activation").post(accountActivation);
router.route("/login").post(login);

module.exports = router;
