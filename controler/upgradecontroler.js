const tour = require("./../models/tourmodel");
const mongoose = require("mongoose");
exports.createtour = async (req, res) => {
  try {
    const newtour = await tour.create(req.body);
    res.status(201).json({
      status: "scucess",
      dataadded: newtour,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err,
    });
  }
};
exports.updatetour = async (req, res) => {
  try {
    const datafound = await tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        "new one is": datafound,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed in update",
      err: err,
    });
  }
};

exports.deletetour = async (req, res) => {
  try {
    const datafound = await tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success ,object is deleted",
    });
    console.log(datafound);
  } catch (err) {
    res.status(400).json({
      status: "faild in deleted",
      error: err,
    });
  }
};
