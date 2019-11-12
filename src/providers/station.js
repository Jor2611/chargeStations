const { Station, Company } = require("../models");
const _ = require("lodash");
const validate = require("validator");
const geolib = require("geolib");

Station.get = async (company_id = null) => {
  try {
    if (company_id === null) {
      const doc = await Station.find();
      return doc
        ? { success: true, data: doc, statusCode: 200 }
        : { success: false, msg: "There is no stations yet!", statusCode: 404 };
    }
    const doc = await getStationsOfCompany(company_id);

    return doc.success
      ? { success: true, data: doc.data, statusCode: 200 }
      : { success: false, msg: doc.msg, statusCode: 404 };
  } catch (e) {
    return { success: false, msg: "Cannot get stations", statusCode: 500 };
  }
};

Station.create = async ({ name, latitude, longitude }, company_id) => {
  try {
    const station = new Station({
      name,
      latitude,
      longitude,
      company_id
    });
    const doc = await station.save();
    return { success: true, data: doc, statusCode: 201 };
  } catch (e) {
    return e.name === "ValidationError"
      ? { success: false, msg: e.message, statusCode: 400 }
      : { success: false, msg: "Cannot Create Station: " + e, statusCode: 500 };
  }
};

Station.update = async (id, data) => {
  const updates = Object.keys(data);
  const allowedUpdates = ["name", "longitude", "latitude"];
  const isValidOperation = updates.every(item => allowedUpdates.includes(item));
  if (!isValidOperation)
    return { success: false, msg: "Invalid updates!", statusCode: 400 };
  try {
    const doc = await Station.findByIdAndUpdate({ _id: id }, data, {
      new: true,
      runValidators: true
    });
    return { success: true, data: doc, statusCode: 200 };
  } catch (e) {
    return e.path === "_id"
      ? {
          success: false,
          msg: "Cannot Update Undefined Station",
          statusCode: 404
        }
      : { success: false, msg: "Cannot Update Station" + e, statusCode: 500 };
  }
};

Station.findInRadius = async (radius = 0, long, lat) => {
  if (!validate.isLatLong(`${lat},${long}`) || !validate.isNumeric(`${radius}`))
    return { success: false, msg: "Wrong Credentials", statusCode: 400 };
  try {
    //Getting southwestern and northeastern coordinates of rectangle which contains
    //circle with center of given coordinates and radius.
    const bounds = await geolib.getBoundsOfDistance(
      { latitude: lat, longitude: long },
      radius * 1000
    );

    //Getting stations within rectangle, (to minimize search bounds)
    const points = await Station.aggregate([
      {
        $match: {
          $and: [
            {
              latitude: { $gte: bounds[0].latitude, $lte: bounds[1].latitude }
            },
            {
              longitude: {
                $gte: bounds[0].longitude,
                $lte: bounds[1].longitude
              }
            }
          ]
        }
      },
      {
        $project: {
          _id: 0,
          name: "$name",
          latitude: "$latitude",
          longitude: "$longitude"
        }
      }
    ]);

    //Filtering points in circle
    const pointsInRadius = points.filter(item => {
      if (
        geolib.isPointWithinRadius(
          { latitude: item.latitude, longitude: item.longitude },
          { latitude: lat, longitude: long },
          radius * 1000
        )
      ) {
        return item;
      }
    });

    //Order by distance from given point
    const orderedPoints = await geolib.orderByDistance(
      { latitude: lat, longitude: long },
      pointsInRadius
    );
    return orderedPoints.length > 0
      ? { success: true, data: orderedPoints, statusCode: 200 }
      : {
          success: true,
          msg: "There is no stations in surfcae of given radius",
          statusCode: 200
        };
  } catch (e) {
    return {
      success: false,
      msg: "Cannot find stations in radius",
      statusCode: 500
    };
  }
};

const getStationsOfCompany = async company_id => {
  try {
    const childStations = await getStationsRecursively(company_id);
    return { success: true, data: childStations, statusCode: 200 };
  } catch (e) {
    return { success: false, msg: "Cannot find company", statusCode: 404 };
  }
};

const getStationsRecursively = async company_id => {
  const company = await Company.findById(company_id).populate({
    path: "stations"
  });
  const result = company.stations;
  if (company.children !== null) {
    for (child of company.children) {
      const data = await getStationsRecursively(child);
      result.push(data);
    }
    result = _.flattenDeep(result);
  }
  return result;
};

module.exports = Station;
