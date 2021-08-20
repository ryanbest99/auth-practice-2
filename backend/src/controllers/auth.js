require("dotenv").config({ path: "./config.env" });
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// exports.register = async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const newUser = await User.create({ username, email, password });
//     res.status(200).json({ success: true, newUser });
//   } catch (err) {
//     res.status(500).json({ success: false, err: err.message });
//   }
// };

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await User.findOne({ email }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          error: "Email is taken",
        });
      }
    });

    const token = jwt.sign(
      { username, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10minutes" }
    );

    console.log(token);

    const emailData = {
      to: email, // Change to your recipient
      from: process.env.EMAIL_FROM, // Change to your verified sender
      subject: "Account Activation Link",
      html: `                
      <h1> Please use the following link to activate your account </h1>
      <strong><p>${process.env.CLIENT_URL}/auth/activate/${token}</p></strong>
      <hr />
      <p> This Email may have sensitive information </p>
      <p>${process.env.CLIENT_URL}</p>
      `,
    };

    sgMail
      .send(emailData)
      .then((response) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
        return res.json({
          message: `Email has been sent to " ${email} " successfully. Follow the instruction to activate your account.`,
        });
      })
      .catch((error) => {
        console.error(error);
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
          res
            .status(200)
            .json({
              success: true,
              newUser,
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
  res.send("Login successful");
};

// exports.register = async (req, res) => {
//   res.send("Register successful");
// };
