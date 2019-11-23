const express = require("express");
require("./db/mongoose");
const { company: companyRouter, station: stationRouter } = require("./routers");

const app = express();

app.use(express.json());
app.use("/company", companyRouter);
app.use("/station", stationRouter);
app.use((req, res, next) => {
  res.status(404).send({ success: false, msg: "Wrong Url Path" });
});
module.exports = app;
