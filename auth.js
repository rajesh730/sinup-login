const jwt = require("jsonwebtoken");
const User = require("./model");
const path = require("path");
const hbs = require("hbs");
const express = require("express");
const app = express();
////////////////////////////////////////////////////////////////////////
const template_path = path.join(__dirname, "/templates/views");
const partials_path = path.join(__dirname, "/templates/partials");
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
////////////////////////////////////////////////////////////////////////

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyUser);
    const user = await User.findOne({ _id: verifyUser._id });
    req.token = token;
    req.user = user;
    console.log(user);
    next();
  } catch (err) {
    // res.status(404).json({
    //   status: "fail",
    //   message: err,
    // });
    res.render("error");
  }
};

module.exports = auth;
