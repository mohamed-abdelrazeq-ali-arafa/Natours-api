const { promisify } = require("util");
const user = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const apperror = require("./../utlis/AppError");
//const node_mailer = require("./../utlis/email");
//const send_email = require("./../utlis/email");
const AppError = require("./../utlis/AppError");

const signtoken = (id) => {
  return jwt.sign({ id: id }, process.env.jwt_secret, {
    expiresIn: process.env.jwtexpire,
  });
};

exports.sign_up = async (req, res, next) => {
  //user.create return promise
  try {
    //specify data to be persist because of security (like any one try to added as admin role)
    const new_user = await user.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordconfirm: req.body.passwordconfirm,
    });
    //token created
    const token = signtoken(new_user._id);

    res.status(201).json({
      status: "Success",
      token,
      user: new_user,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      error: err.message,
    });
  }
};

exports.log_in = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //check if email &pass exist
    if (!email || !password) {
      return next(new apperror("Please enter email and password", 400));
    }

    //check if user exist and password is correct
    //select field from db that not selected we use +field name to shown in postman

    const founded_user = await user
      .findOne({ email: email })
      .select("+password");

    if (
      !founded_user ||
      !(await founded_user.correct_password(password, founded_user.password))
    )
      return next(new apperror("Incorrect Email and Password"), 404);
    //check token
    const token = signtoken(founded_user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(404).json({
      status: "success",
    });
  }
};

exports.protect = async (req, res, next) => {
  //get token and check if exist
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization;
      token = token.split(" ")[1];
    }
    if (!token)
      return next(
        new apperror("you are not loged in please log in to get access"),
        401
      );

    //verification token
    const decoded = await promisify(jwt.verify)(token, process.env.jwt_secret);

    //check if user still exist (what if user has been deleted in this time)
    const currentuser = await user.findById(decoded.id);
    if (!currentuser)
      return next(new apperror("the user is no longer exist"), 401);
    req.user = currentuser;
    next();
  } catch (err) {
    res.status(401).json({
      status: "failed",
      error: err,
    });
  }
};

//pass argument to middleware function  wraper function
exports.restrict_to = (...roles) => {
  return (req, res, next) => {
    //roles is arr
    if (!roles.includes(req.user.role))
      return next(new apperror("you dont have permission", 403));
    next();
  };
};

exports.forget_password = async (req, res, next) => {
  //get user based on posted email

  const currentuser = await user.findOne({ email: req.body.email });
  if (!currentuser)
    return next(new apperror("there is no user found with this email"), 404);

  //generate random  reset token
  const resettoken = currentuser.create_password_reset_token();
  await currentuser.save({ validateBeforeSave: false });
  //send it to useremail
   const reset_url = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetpassword/${resettoken}`;
  const message = `forget passord ? submit a patch request with your new password`;
  try {
   /* await send_email({
      email: currentuser.email,
      subject: "Your password reset token",
      message,
    })*/;
    res.status(200).json({
      status: "Success",
      message: "Token sent to email",
    });
  } catch (err) {
    await currentuser.save({ validateBeforeSave: false });
    res.status(400).json({
      error: err,
    });
  }
};
exports.reset_password = (req, res, next) => {};
