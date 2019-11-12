const { company } = require("../providers");
const middleware = require("./middleware/middleware");
const router = require("express").Router();

router.get("/company", middleware, async (req, res) => {
  try {
    res.send(req.company);
  } catch (e) {}
});

router.get("/companies", async (req, res) => {
  try {
    const doc = await company.find();
    return doc
      ? res.status(200).send(doc)
      : res.status(404).send("Cannot find companies");
  } catch (e) {
    return res.status(500).send("Cannot get companies");
  }
});

router.post("/company", async (req, res) => {
  try {
    const doc = await company.create(req.body);
    return doc.success
      ? res.status(doc.statusCode).send(doc.data)
      : res.status(doc.statusCode).send(doc.msg);
  } catch (e) {
    return res.status(500).end();
  }
});

router.delete("/company", middleware, async (req, res) => {
  try {
    await req.company.remove();
    return res.status(200).send(`Company ${req.company.name} removed.`);
  } catch (e) {
    return res.status(500).end();
  }
});

router.patch("/company/own/", middleware, async (req, res) => {
  const { companyIdNeedOwn } = req.body;
  if (req.company._id === companyIdNeedOwn.toUpperCase())
    return res.status(400).send("Company cannot be owned by itself!");
  try {
    const doc = await company.own(
      req.company._id,
      companyIdNeedOwn.toUpperCase()
    );
    return doc.success
      ? res
          .status(doc.statusCode)
          .send(`${companyIdNeedOwn} owned successfully!`)
      : res.status(doc.statusCode).send(doc.msg);
  } catch (e) {
    return res.status(500).end();
  }
});

module.exports = router;
