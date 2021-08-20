require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const connectDB = require("./db/mongoose");
connectDB();
const userRouter = require("./routers/users");

app.use(express.json());
app.use("/api/auth", userRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
