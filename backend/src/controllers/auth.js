require("dotenv").config({ path: "./config.env" });
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.signUp = async (req, res) => {
  //   res.send("Sign upsuccess");
  const { username, email, password } = req.body;
  try {
    const newUser = await User.create({ username, email, password });
    const token = await newUser.generateAuthToken();
    res.status(200).json({ success: true, newUser, token });
  } catch (err) {
    res.status(500).json({ success: false, err: err.message });
  }
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await User.findOne({ email }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          error: "Email is taken",
        });
      }

      const token = jwt.sign(
        { username, email, password },
        process.env.JWT_ACCOUNT_ACTIVATION,
        { expiresIn: "10minutes" }
      );

      const message = `
      <h1> Please use the following link to activate your account </h1>
      <strong><p>${process.env.CLIENT_URL}/auth/activate/${token}</p></strong>
      <hr />
      <p> This Email may have sensitive information </p>
      <p>${process.env.CLIENT_URL}</p>
      `;

      const subject = "Account Activation Link";

      sendEmail({ email, subject, text: message });

      res.status(202).json({
        message: `Email has been sent to " ${email} " successfully. Follow the instruction to activate your account.`,
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, err: err.message });
  }
};

exports.accountActivation = async (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      async function (err, decoded) {
        if (err) {
          return res.status(400).json({ err: "Expied Link. Signup Again" });
        }

        const { username, email, password } = jwt.decode(token);

        try {
          const newUser = await User.create({ username, email, password });
          const token = await newUser.generateAuthToken();
          res.status(200).json({
            success: true,
            newUser,
            token,
            message: "Congratulations! You are signed-up. Please Sign-in",
          });
        } catch (err) {
          res.status(500).json({ success: false });
        }
      }
    );
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.status(200).json({ success: true, user, token });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};

exports.logoutall = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};

exports.users = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};

exports.user = async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(500).json({ success: false, err: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    const message = `
      <h1> You Account Has Been Removed Successfully. </h1>
      <hr />
      <p> Thanks for having used our service. </p>
      `;

    const subject = "Your Account Has Been Deleted Successfully";

    sendEmail({ email: req.user.email, subject, text: message });

    res.status(202).json({
      message: `Your Account has been removed successfully. `,
    });
  } catch (err) {
    res.status(500).json({ success: false, err: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
};

// exports.register = async (req, res) => {
//   res.send("Register successful");
// };
