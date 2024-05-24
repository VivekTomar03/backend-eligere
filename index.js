const express = require('express');
const cors = require('cors');
require("dotenv").config()
const { connection } = require('./config/db');
const { userRouter } = require('./Routes/user.route');
const app = express();
app.use(cors())
app.use(express.json());
app.use("/user", userRouter)

const PORT = process.env.PORT
app.listen(PORT, async () => {
  try {
    await connection;
    console.log("server is connected to db");
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});