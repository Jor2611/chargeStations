const { Company } = require("../../models");
const { COMPANY_NOT_FOUND } = require("../../utils/response_constants");

const middleware = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findById(companyId);
    req.company = company;
    next();
  } catch (e) {
    return res.status(COMPANY_NOT_FOUND.statusCode).send(COMPANY_NOT_FOUND);
  }
};

module.exports = middleware;
