const { Company } = require("../models");
const _ = require("lodash");
const {
  COMPANY_CREATED,
  COMPANY_EXIST,
  COMPANY_CANNOT_CREATE,
  COMPANY_GET_DATA,
  COMPANY_CANNOT_GET_DATA,
  INVALID_CRED,
  COMPANY_DELETED,
  COMPANY_NOT_FOUND,
  COMPANY_SELF_OWN,
  COMPANY_OWNED,
  COMPANY_ALREADY_OWNED,
  COMPANY_ALREADY_OWNED_BY_THIS,
  COMPANY_CANNOT_BE_OWNED,
  COMPANY_CANNOT_DELETE
} = require("../utils/response_constants");

Company.get = async () => {
  try {
    const data = await Company.find();
    COMPANY_GET_DATA.data = data;
    return COMPANY_GET_DATA;
  } catch (e) {
    return COMPANY_CANNOT_GET_DATA;
  }
};

Company.create = async ({ name }) => {
  try {
    const company = new Company({
      name
    });
    const data = await company.save();
    COMPANY_CREATED.data = data;
    return COMPANY_CREATED;
  } catch (e) {
    if (e.name === "ValidationError") return INVALID_CRED;
    else if (e.name === "MongoError" && e.code === 11000) return COMPANY_EXIST;
    return COMPANY_CANNOT_CREATE;
  }
};

Company.getChildCompanies = async companyId => {
  try {
    const data = await getCompaniesRecursively(companyId);
    COMPANY_GET_DATA.data = data;
    return COMPANY_GET_DATA;
  } catch (e) {
    console.log(e);
    return COMPANY_NOT_FOUND;
  }
};

Company.own = async (ownerId, companyToOwn) => {
  try {
    if (ownerId == companyToOwn) return COMPANY_SELF_OWN;
    if (!companyToOwn) return INVALID_CRED;
    let company = await Company.updateOne(
      { _id: ownerId },
      { $push: { children: companyToOwn } },
      { new: true }
    );
    return COMPANY_OWNED;
  } catch (e) {
    switch (e.message) {
      case "Already Owned By This Company!":
        return COMPANY_ALREADY_OWNED_BY_THIS;
      case "Company Not Found":
        return COMPANY_NOT_FOUND;
      case "Company Owned by":
        return COMPANY_ALREADY_OWNED;
      default:
        return COMPANY_CANNOT_BE_OWNED;
    }
  }
};

Company.remove = async company => {
  try {
    await company.remove();
    return COMPANY_DELETED;
  } catch (e) {
    return COMPANY_NOT_FOUND;
  }
};

const getCompaniesRecursively = async company_id => {
  const company = await Company.findById(company_id).populate({
    path: "children"
  });
  let result = company.children || [];
  if (company.children.length > 0) {
    for (child of company.children) {
      if (child.children.length > 0) {
        const data = await getCompaniesRecursively(child._id);
        result = _.concat(result, data);
      }
    }
  }
  return result;
};

module.exports = Company;
