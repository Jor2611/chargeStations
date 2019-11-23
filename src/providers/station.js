const { Station, Company } = require("../models");
const _ = require("lodash");
const {
  STATION_GET_DATA,
  STATION_NOT_FOUND,
  STATION_DELETED,
  STATION_CANNOT_DELETE,
  STATION_CANNOT_CREATE,
  STATION_CREATED,
  STATION_UPDATED,
  STATION_CANNOT_UPDATE,
  STATION_IN_RADIUS_GET_DATA,
  STATION_IN_RADIUS_GET_DATA_FAILURE,
  STATION_GET_DATA_FAILURE,
  INVALID_CRED
} = require("../utils/response_constants");
const validate = require("validator");
const geolib = require("geolib");

Station.get = async (company_id = null) => {
  try {
    if (company_id === null) {
      const data = await Station.find();
      STATION_GET_DATA.data = data;
      return STATION_GET_DATA;
    }
    const data = await getStationsOfCompany(company_id);
    STATION_GET_DATA.data = data.data;
    return data.success ? STATION_GET_DATA : STATION_NOT_FOUND;
  } catch (e) {
    return STATION_NOT_FOUND;
  }
};

Station.getStation = async station_id => {
  try {
    const data = await Station.findById(station_id);
    STATION_GET_DATA.data = data;
    return data ? STATION_GET_DATA : STATION_NOT_FOUND;
  } catch (e) {
    return STATION_NOT_FOUND;
  }
};

Station.create = async ({ name, latitude, longitude }, company_id) => {
  try {
    await Company.findById(company_id);
    const station = new Station({
      name,
      latitude,
      longitude,
      company_id
    });
    const data = await station.save();
    STATION_CREATED.data = data;
    return STATION_CREATED;
  } catch (e) {
    return e.name === "ValidationError" ? INVALID_CRED : STATION_CANNOT_CREATE;
  }
};

Station.update = async (id, doc) => {
  const updates = Object.keys(doc);
  const allowedUpdates = ["name", "longitude", "latitude"];
  const isValidOperation = updates.every(item => allowedUpdates.includes(item));
  if (!isValidOperation) return INVALID_CRED;
  try {
    const data = await Station.findByIdAndUpdate({ _id: id }, doc, {
      new: true,
      runValidators: true
    });
    STATION_UPDATED.data = data;
    return data ? STATION_UPDATED : STATION_NOT_FOUND;
  } catch (e) {
    return e.path === "_id" ? STATION_NOT_FOUND : STATION_CANNOT_UPDATE;
  }
};

Station.removeStation = async station_id => {
  try {
    let station = await Station.findOneAndDelete({ _id: station_id });
    if (!station) return STATION_NOT_FOUND;
    return STATION_DELETED;
  } catch (e) {
    return STATION_NOT_FOUND;
  }
};

Station.findInRadius = async (radius = 0, long, lat) => {
  if (!validate.isLatLong(`${lat},${long}`) || !validate.isNumeric(`${radius}`))
    return INVALID_CRED;
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
    STATION_IN_RADIUS_GET_DATA.data = orderedPoints;
    return STATION_IN_RADIUS_GET_DATA;
  } catch (e) {
    return STATION_IN_RADIUS_GET_DATA_FAILURE;
  }
};

const getStationsOfCompany = async company_id => {
  try {
    const childStations = await getStationsRecursively(company_id);
    return { success: true, data: childStations };
  } catch (e) {
    return STATION_IN_RADIUS_GET_DATA_FAILURE;
  }
};

const getStationsRecursively = async company_id => {
  const company = await Company.findById(company_id).populate({
    path: "stations"
  });

  let result = company.stations;
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
