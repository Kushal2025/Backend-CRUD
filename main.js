// -------------------- Imports --------------------
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

// -------------------- App Config --------------------
const app = express();
const PORT = process.env.PORT || 4000;

// -------------------- Database Connection --------------------
connectDB();

// -------------------- Middlewares --------------------
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "mySecret",
    saveUninitialized: true,
    resave: false,
  })
);

// -------------------- Flash Message Middleware --------------------
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});
app.use(express.static('uploads'));
// -------------------- Template Engine --------------------
app.set("view engine", "ejs");

// -------------------- Routes --------------------
app.use("", require("./routes/routes"));

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`✅ Server started at http://localhost:${PORT}`);
});
