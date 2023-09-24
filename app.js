const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

mongoose
  .connect(process.env.DATABASE, {})
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello World");
});

const authRoutes = require("./routes/user");
const doorRoutes = require("./routes/door");
const historyRoutes = require("./routes/history");

app.use("/", authRoutes);
app.use("/", doorRoutes);
app.use("/", historyRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
