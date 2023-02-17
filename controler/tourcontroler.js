const tour = require("../models/tourmodel");
const api_feature = require("../utlis/apifeature");
const mongoose = require("mongoose");

const { castObject } = require("../models/tourmodel");
exports.alias_sort_by_price = (req, res, next) => {
  req.query.sort = "price";
  req.query.limit = "5";
  req.query.fields = "price name difficulty";
  next();
};

exports.get_all = async (req, res) => {
  try {
    const features = new api_feature(tour.find({}), req.query)
      .filter()
      .sort()
      .limit_fileds()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      results: tours.length,
      data_from_database: tours,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
    });
  }
};

exports.get_tour_by_id = async (req, res) => {
  try {
    const founded_tour = await tour.findById(req.params.id);
    console.log(req.params.id);
    res.status(200).json({
      status: "success retrieve",
      dataretrieved: founded_tour,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed to retrieve",
    });
  }
};

exports.get_status = async (req, res) => {
  try {
    const data = await tour.aggregate([
      {
        $match: {
          ratingavg: { $gte: 4.5 },
        },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRating: { $sum: "$ratingquantity" },
          avgRating: { $avg: "$ratingavg" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
      {
        $match: {
          _id: { $ne: "EASY" },
        },
      },
    ]);
    res.status(200).json({
      status: "sucees aggregation ",
      data: data,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed aggregation",
      err: err,
    });
  }
};

exports.monthly_plan = async (req, res) => {
  try {
    let year = req.params.year * 1; //2021
    let tours = await tour.aggregate([
      {
        $unwind: "$startdates",
      },
      {
        $match: {
          startdates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startdates" },
          num_tours_start: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          num_tours_start: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);
    res.status(200).json({
      number: tours.length,
      unwind: tours,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      err: err,
    });
  }
};
