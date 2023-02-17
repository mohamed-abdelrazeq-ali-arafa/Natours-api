const express = require("express");
const tour_router = express.Router();
const fs = require("fs");
const tour_controler = require("../controler/tourcontroler");

tour_router
  .route("/top5cheap")
  .get(tour_controler.alias_sort_by_price, tour_controler.get_all);
tour_router.route("/all").get(tour_controler.get_all);
tour_router.route("/status").get(tour_controler.get_status);
tour_router.route("/monthly_plan/:year").get(tour_controler.monthly_plan);
tour_router.route("/:id").get(tour_controler.get_tour_by_id);

module.exports = tour_router;

