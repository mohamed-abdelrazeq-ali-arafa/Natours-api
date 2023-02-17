const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const user_schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please Enter  your name"],
  },
  email: {
    type: String,
    unique: true,
    //make email all lower case
    lowercase: true,
    validate: [validator.isEmail, "Please enter valid Email"],
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    unique: true,
    required: [true, "please  Enter password"],
    minlength: 8,
    select: false,
  },
  passwordconfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        //this only work on save method (save===user.create())
        //el refet tot cueernt element (password confirm)
        return this.password === el;
      },
      message: "Password are not the same",
    },
  },

  address: { country: String, street: String },
  phone: {
    type: String,
  },
  passwordchangedat: { type: Date },
  passwordresettoken: String,
  passwordresetexpire: Date,
});
user_schema.pre("save", async function (next) {
  //if its already encrypted
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  //remove password confirmed  from persist on data base (needed in input only)
  this.passwordconfirm = undefined;
  next();
});

//instance method will run on all document
user_schema.methods.correct_password = async function (
  bodypassword,
  userpassword
) {
  return await bcrypt.compare(bodypassword, userpassword);
};

user_schema.methods.create_password_reset_token = function () {
  const reset_token = crypto.randomBytes(32).toString("hex");
  this.passwordresettoken = crypto
    .createHash("sha256")
    .update(reset_token)
    .digest("hex");
  console.log({ reset_token }, this.passwordresettoken);
  this.passwordresetexpire = Date.now() + 10 * 60 * 1000;

  return reset_token;
};

const user = mongoose.model("User", user_schema);
module.exports = user;
