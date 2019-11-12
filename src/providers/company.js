const { Company } = require("../models");
const uuid = require("uuid/v4");

Company.get = async name => {
  const data = await Company.findOne({ name });
  return data ? data : null;
};

Company.create = async ({ name }) => {
  try {
    const company = new Company({
      name
    });
    const doc = await company.save();
    return { success: true, data: doc, statusCode: 201 };
  } catch (e) {
    if (e.name === "MongoError" && e.code === 11000)
      return e.name === "MongoError" && e.code === 11000
        ? { success: false, msg: "Company Already exist!", statusCode: 400 }
        : { success: false, msg: "Cannot create Company.", statusCode: 500 };
  }
};

Company.own = async (ownerId, companyToOwn) => {
  try {
    const doc = await Company.updateOne(
      { _id: ownerId },
      { $push: { children: companyToOwn } },
      { new: true }
    );
    return { success: true, data: doc, statusCode: 200 };
  } catch (e) {
    return e.message
      ? { success: false, msg: e.message, statusCode: 500 }
      : { success: false, msg: "Cannot Own Compnay", statusCode: 500 };
  }
};

module.exports = Company;
