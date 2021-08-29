require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const app = express();

const connectDB = require("./db/mongoose");
connectDB();
const userRouter = require("./routers/users");

app.use(express.json());
app.use(cors());
app.use("/api/auth", userRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
