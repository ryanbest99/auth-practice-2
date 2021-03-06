const express = require("express");
const router = express.Router();
const {
  signUp,
  register,
  accountActivation,
  login,
  logout,
  logoutall,
  users,
  user,
  deleteUser,
  updateUser,
} = require("../controllers/auth");
const auth = require("../middleware/auth");

router.route("/signup").post(signUp);
router.route("/register").post(register);
router.route("/account-activation").post(accountActivation);
router.route("/login").post(login);
router.route("/users").get(users);
router.route("/user").get(auth, user);
router.route("/logout").post(auth, logout);
router.route("/logoutall").post(auth, logoutall);
router.route("/deleteuser").post(auth, deleteUser);
router.route("/updateuser").post(auth, updateUser);

module.exports = router;
