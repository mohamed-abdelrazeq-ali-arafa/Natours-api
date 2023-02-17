const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const tour = require("./models/tourmodel");
dotenv.config({ path: "config.env" });
const DB = process.env.data_base_local;
const port_Data_base = process.env.port_Data_base;
exports.rundatabase = mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(`DB connection is susccesful and on port ${port_Data_base}`);
  })
  .catch((err) => {
    console.log(`err is ${err}`);
  });

//readjson file
const data = JSON.parse(fs.readFileSync("./tours-simple.json", "utf-8"));

//imoprtdata intodb
const import_data = async () => {
  try {
    await tour.create(data);
    console.log(`data successfully imported`);
  } catch (err) {
    console.log(`error is ${err}`);
  }
  process.exit();
};

const delete_all = async () => {
  try {
    await tour.deleteMany({});
    console.log(`data successfully deleted`);
  } catch (err) {
    console.log(`error is ${err}`);
  }
  process.exit();
};
if (process.argv[2] === "--import") {
  import_data();
} else if (process.argv[2] === "--delete") {
  delete_all();
}
//to run it D:\learning nodemong>node importdata.js --import
