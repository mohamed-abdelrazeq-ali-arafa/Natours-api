const mongoose = require("mongoose");
const tourschema = new mongoose.Schema(
  {
    id: Number,
    name: {
      type: String,
      required: true,
      unique: [true, "the Name must br unique"],
      trim: true,
      maxLength: [40, "name of tour must be less than 40 character"],
      minLength: [10, "name of tour must be more than 10"],
    },
    rating: { type: Number, default: 10 },
    price: {
      type: Number,
      required: false,
    },
    duration: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be easy or medium or difficult",
      },
    },
    ratingavg: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1,0"],
      max: [5, "Rating must be below 5,0"],
    },
    ratingquantity: {
      type: Number,
      default: 0,
    },
    pricediscount: {
      type: Number,
      validate: {
        validator: function () {
          //this only point to current document
          return this.pricediscount < this.price;
        },
        message: "Discount price must be less than price",
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startdates: [Date],
    screttour: {
      type: Boolean,
      default: false,
    },
  },

  //second object passed is schema option
  {
    //each time data is outputed as json
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtual means they ar not persist on database
tourschema.virtual("duration_in_weeks").get(function () {
  return this.duration / 7;
});

tourschema.pre(/^find/, function (next) {
  //this refer to query so we can chain
  this.find({ screttour: { $ne: false } });
  this.start = Date.now();
  next();
});
tourschema.post(/^find/, function (doc, next) {
  //this refer to query so we can chain
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});
//aggregation middlewar
tourschema.pre("aggregate", function (next) {
  //this refer to aggreagte pipeline
  this.pipeline().unshift({ $match: { secrettour: { $ne: true } } });
  next();
});

const tour = mongoose.model("mynew", tourschema, "tourr");
module.exports = tour;
