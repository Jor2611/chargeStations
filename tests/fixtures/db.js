const mongoose = require("mongoose");
const { Company, Station } = require("../../src/models");

const companyOneId = new mongoose.Types.ObjectId();
const companyOne = {
  _id: companyOneId,
  name: "Test Company 1"
};

const companyTwoId = new mongoose.Types.ObjectId();
const companyTwo = {
  _id: companyTwoId,
  name: "Test Company 2"
};

const stationOneId = new mongoose.Types.ObjectId();
const stationOne = {
  _id: stationOneId,
  name: "Station 1 Yerevan",
  latitude: 40.173969,
  longitude: 44.50275,
  company_id: companyOneId
};

const stationTwoId = new mongoose.Types.ObjectId();
const stationTwo = {
  _id: stationTwoId,
  name: "Station 2 Moscow",
  latitude: 55.755871,
  longitude: 37.61768,
  company_id: companyOneId
};

const stationThreeId = new mongoose.Types.ObjectId();
const stationThree = {
  _id: stationThreeId,
  name: "Station 3 Tehran",
  latitude: 35.689198,
  longitude: 51.388973,
  company_id: companyTwoId
};

const configureDatabase = async () => {
  await Company.deleteMany();
  await Station.deleteMany();
  await new Company(companyOne).save();
  await new Company(companyTwo).save();
  await new Station(stationOne).save();
  await new Station(stationTwo).save();
  await new Station(stationThree).save();
};

module.exports = {
  companyOne,
  companyOneId,
  companyTwo,
  companyTwoId,
  configureDatabase,
  stationOne,
  stationOneId,
  stationTwo,
  stationTwoId,
  stationThree,
  stationThreeId
};
