const { Company } = require("../../models");

const middleware = async (req, res, next) => {
  try {
    const { companyId } = req.query;
    const company = await Company.findById(companyId);
    req.company = company;
    next();
  } catch (e) {
    return res.status(404).send({ msg: "Company not exist" });
  }
};

module.exports = middleware;
