const express = require("express");
const upgradecontroler = require("../controler/upgradecontroler");
const authcontroler = require("../controler/authcontroler");
const upgrade = express.Router();

upgrade.route("/add").post(upgradecontroler.createtour);
upgrade.route("/delete/:id").delete(upgradecontroler.deletetour);
upgrade.route("/update/:id").patch(upgradecontroler.updatetour);
upgrade.route("/forgetpassword").post(authcontroler.forget_password);

module.exports = upgrade;
