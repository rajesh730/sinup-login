const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = "mynameisrajeshrajpandey";

const schema = new mongoose.Schema({
  name: {
    type: String,
    reuired: [true, `name must be filled`],
    trim: true,
  },

  email: {
    type: String,
    reuired: [true, `name must be filled`],
    trim: true,
    unique: true,
    validate: [validator.isEmail, "provide valid email"],
  },

  password: {
    type: String,
    require: [true, `please provide a passord`],
    minlength: 4,
    // select: false,
  },
  conformPassword: {
    type: String,
    require: [true, `please provide a passord`],
    minlength: 4,
  },
  question: {
    type: String,
    require: [true, `please provide a passord`],
    minlength: 4,
  },
  answer: {
    type: String,
    require: [true, `please provide a passord`],
    minlength: 4,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

schema.methods.generateAuthToken = async function () {
  try {
    const token = await jwt.sign({ _id: this._id }, SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    // await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

//// pre ==>> hash password before saving it

schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.conformPassword = undefined;
  }
  next();
});

const User = mongoose.model("User", schema);

module.exports = User;
