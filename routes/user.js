const express = require("express");
const authcontroler = require("../controler/authcontroler");
const usercontroler = require("./../controler/usercontroler");

const userroute = express.Router();
userroute.route("/signup").post(authcontroler.sign_up);
userroute.route("/login").post(authcontroler.log_in);
userroute.route("/forgetpassword").post(authcontroler.forget_password);

userroute
  .route("/all")
  .get(
    authcontroler.protect,
    authcontroler.restrict_to("admin"),
    usercontroler.get_all
  );
  

userroute.route("/resetpassword/:token", authcontroler.reset_password);

module.exports = userroute;
