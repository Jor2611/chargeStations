const { station } = require("../providers");
const middleware = require("./middleware/middleware");
const router = require("express").Router();

router.get("/stations", async (req, res) => {
  try {
    const doc = await station.get(req.query.companyId);
    return doc.success
      ? res.status(200).send(doc.data)
      : res.status(400).send(doc.msg);
  } catch (e) {
    return res.status(500).send("Connat get stations");
  }
});

router.patch("/station/:stationId", async (req, res) => {
  try {
    const doc = await station.update(req.params.stationId, req.body);
    return doc.success
      ? res.status(doc.statusCode).send(doc.data)
      : res.status(doc.statusCode).send(doc.msg);
  } catch (e) {
    return res.status(500).end();
  }
});

router.get("/station/:stationId", async (req, res) => {
  try {
    const doc = await station.findById(req.params.stationId);
    return res.status(200).send(doc);
  } catch (e) {
    return res.status(404).send("Station not found");
  }
});

router.get("/stationsInRadius", async (req, res) => {
  const { radius, long, lat } = req.query;
  try {
    radius = parseFloat(radius);
    long = parseFloat(long);
    lat = parseFloat(lat);
    const doc = await station.findInRadius(radius, long, lat);
    return doc.success
      ? res.status(doc.statusCode).send(doc.data)
      : res.status(doc.statusCode).send(doc.msg);
  } catch (e) {
    return res.status(500).send("Cannot get stations in radius");
  }
});

router.post("/station", middleware, async (req, res) => {
  try {
    const doc = await station.create(req.body, req.company._id);
    return doc.success
      ? res.status(doc.statusCode).send(doc.data)
      : res.status(doc.statusCode).send(doc.msg);
  } catch (e) {
    return res.status(500).end();
  }
});

router.delete("/station/:stationId", async (req, res) => {
  try {
    const doc = await station.findOneAndDelete({ _id: req.params.stationId });
    return !doc
      ? res.status(404).send("Unable to delete")
      : res.status(200).send("Station Deleted!");
  } catch (e) {
    res.status(500).end();
  }
});

module.exports = router;
