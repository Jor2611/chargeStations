const mongoose = require("mongoose");
const { Company, Station } = require("../src/models");
const companies = require("../companies.json");
const stations = require("../stations.json");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    let companyData = await Company.find();
    let stationData = await Station.find();
    if (companyData.length !== 0 || stationData.length !== 0)
      return process.exit();
    companyData = await Company.insertMany(companies);
    stationData = await Station.insertMany(stations);
    return process.exit();
  } catch (e) {
    console.log("error: " + e);
    return "Cannot access to db";
  }
})();
