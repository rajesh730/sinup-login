const express = require("express");
const app = express();
const User = require("./model");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./auth");
const path = require("path");
const hbs = require("hbs");
// const { model } = require("mongoose");

////////////////////////////////////////////////////////////////////////
const template_path = path.join(__dirname, "/templates/views");
const partials_path = path.join(__dirname, "/templates/partials");
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
////////////////////////////////////////////////////////////////////////
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

////////////////////////////////////////////////////////////////////////////////////////
//index page
app.get(["/", "/index"], async (req, res) => {
  res.render("index");
});

////////////////////////////////////////////////////////////////////////////////////////
//secure page
app.get("/secure", auth, async (req, res) => {
  try {
    const name = req.user.name;
    // const email = req.user.email;
    res.render("secure", { name });
  } catch (err) {
    res.send("plz login to visit the tab");
  }
});

////////////////////////////////////////////////////////////////////////////////////////
//signup
app.post("/sinup", async (req, res) => {
  try {
    const data = await new User(req.body);

    data.save().then(() => {
      res.redirect("login");
    });
    const token = await data.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60 * 60 * 90 * 24),
      httpOnly: true,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/sinup", async (req, res) => {
  res.render("sinup");
});

////////////////////////////////////////////////////////////////////////////////////////
//login
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    const token = await user.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60 * 60 * 90 * 24),
      httpOnly: true,
      // secure: true,
    });
    if (isMatch) {
      res.redirect("secure");
    } else {
      res.status(404).json({
        status: "fail",
        message: `Invalid login details`,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

////////////////////////////////////////////////////////////////////////////////////////
//logout page
app.get("/logout", auth, async (req, res) => {
  try {
    res.clearCookie("jwt");
    req.user.tokens = req.user.tokens.filter((ele) => {
      return ele.token !== req.token;
    });
    /////----logout from all device----////
    req.user.tokens = [];
    /////----logout from all device----////
    // console.log("hello");
    await req.user.save();
    res.redirect("login");
  } catch (err) {
    // res.status(404).json({
    //   status: "fail",
    //   message: "try again ",
    // });
    res.status(404).send("password or email not match!");
  }
});

module.exports = app;
