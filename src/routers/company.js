const { company } = require("../providers");
const middleware = require("./middleware/middleware");
const router = require("express").Router();
const {
  SERVER_ERROR,
  COMPANY_NOT_FOUND
} = require("../utils/response_constants");

router.get("/", async (req, res) => {
  try {
    const doc = await company.get();
    return res.status(doc.statusCode).send(doc);
  } catch (e) {
    return res.status(SERVER_ERROR.statusCode).send(SERVER_ERROR);
  }
});

router.get("/:companyId", middleware, async (req, res) => {
  try {
    return res
      .status(200)
      .send({ success: true, statusCode: 200, data: req.company });
  } catch (e) {
    return res.status(SERVER_ERROR.statusCode).send(SERVER_ERROR);
  }
});

router.get("/:companyId/childCompanies", async (req, res) => {
  try {
    const doc = await company.getChildCompanies(req.params.companyId);
    return res.status(doc.statusCode).send(doc);
  } catch (e) {
    return res.status(SERVER_ERROR.statusCode).send(SERVER_ERROR);
  }
});

router.post("/", async (req, res) => {
  try {
    const doc = await company.create(req.body);
    return res.status(doc.statusCode).send(doc);
  } catch (e) {
    return res.status(SERVER_ERROR.statusCode).send(SERVER_ERROR);
  }
});

router.delete("/:companyId", middleware, async (req, res) => {
  try {
    let doc = await company.remove(req.company);
    return res.status(doc.statusCode).send(doc);
  } catch (e) {
    return res.status(SERVER_ERROR.statusCode).send(SERVER_ERROR);
  }
});

router.patch("/:companyId/own/", middleware, async (req, res) => {
  try {
    const doc = await company.own(req.company._id, req.body.companyIdNeedOwn);
    return res.status(doc.statusCode).send(doc);
  } catch (e) {
    if (e.name === "TypeError")
      return res.status(COMPANY_NOT_FOUND.statusCode).send(COMPANY_NOT_FOUND);
    return res.status(SERVER_ERROR.statusCode).send(SERVER_ERROR);
  }
});

module.exports = router;
