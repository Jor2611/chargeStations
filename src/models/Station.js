const mongoose = require("mongoose");
const validate = require("validator");

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    latitude: {
      type: Number,
      trim: true,
      required: true,
      validate(value) {
        if (!validate.isLatLong(`${value},40`))
          throw new Error("Latitude is invalid!");
      }
    },
    longitude: {
      type: Number,
      trim: true,
      required: true,
      validate(value) {
        if (!validate.isLatLong(`40,${value}`))
          throw new Error("Longitude is invalid!");
      }
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Company"
    }
  },
  {
    timestamps: true
  }
);

const Station = mongoose.model("Station", stationSchema, "Stations");

module.exports = Station;
