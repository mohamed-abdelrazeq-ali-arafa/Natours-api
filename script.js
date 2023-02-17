const express = require("express");
const dotenv = require("dotenv");
const app = express();
const mongoose = require("mongoose");
dotenv.config({ path: "config.env" });
const connectWithDataBase = require("./importdata.js");
const port_server = process.env.port;
const morgan = require("morgan");
app.use(morgan("dev"));

app.use(express.json());
const app_error = require("./utlis/AppError");
const error_controler = require("./controler/errorcontroler");
const router = require("./routes/tour");
const upgrade = require("./routes/upgrade");
const user = require("./routes/user");
app.use("/api/v1", upgrade);
app.use("/api/v1/tours", router);
app.use("/api/v1/user", user);

//handl all route undefind ,all is for all verbs,
app.all("*", (req, res, next) => {
  next(new app_error(`cant find ${req.url} on this server`, 404));
});
app.use(error_controler);

app.listen(port_server, () =>
  console.log(`server is runing on ${port_server}`)
);
