const express = require("express");
require("./db/mongoose");
const { company: companyRouter, station: stationRouter } = require("./routers");

const app = express();

app.use(express.json());
app.use(companyRouter);
app.use(stationRouter);

module.exports = app;
