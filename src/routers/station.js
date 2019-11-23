const { station } = require("../providers");
const middleware = require("./middleware/middleware");
const router = require("express").Router();
const {
  SERVER_ERROR,
  COMPANY_NOT_FOUND
} = require("../utils/response_constants");

router.get("/", async (req, res) => {
  try {
    const doc = await station.get(req.query.companyId);
    return res.status(doc.statusCode).send(doc);
  } catch (e) {
    return res.status(SERVER_ERROR.statusCode).send(SERVER_ERROR);
  }
});

router.patch("/:stationId", async (req, res) => {
  try {
    const doc = await station.update(req.params.stationId, req.body);
    return res.status(doc.statusCode).send(doc);
  } catch (e) {
    return res.status(SERVER_ERROR.statusCode).send(SERVER_ERROR);
  }
});

router.get("/stationsInRadius", async (req, res) => {
  let { radius, long, lat } = req.query;
  try {
    radius = parseFloat(radius);
    long = parseFloat(long);
    lat = parseFloat(lat);
    const doc = await station.findInRadius(radius, long, lat);
    return res.status(doc.statusCode).send(doc);
  } catch (e) {
    return res.status(SERVER_ERROR.statusCode).send(SERVER_ERROR);
  }
});

router.get("/:stationId", async (req, res) => {
  try {
    const doc = await station.getStation(req.params.stationId);
    return res.status(doc.statusCode).send(doc);
  } catch (e) {
    return res.status(SERVER_ERROR.statusCode).send(SERVER_ERROR);
  }
});

router.post("/:companyId", middleware, async (req, res) => {
  try {
    const doc = await station.create(req.body, req.company._id);
    return res.status(doc.statusCode).send(doc);
  } catch (e) {
    if (e.name === "TypeError")
      return res.status(COMPANY_NOT_FOUND.statusCode).send(COMPANY_NOT_FOUND);
    return res.status(SERVER_ERROR.statusCode).send(SERVER_ERROR);
  }
});

router.delete("/:stationId", async (req, res) => {
  try {
    const doc = await station.removeStation(req.params.stationId);
    return res.status(doc.statusCode).send(doc);
  } catch (e) {
    return res.status(SERVER_ERROR.statusCode).send(SERVER_ERROR);
  }
});

module.exports = router;
