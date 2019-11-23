const mongoose = require("mongoose");
const Station = require("./Station");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }]
  },
  {
    timestamps: true
  }
);

companySchema.virtual("stations", {
  ref: "Station",
  localField: "_id",
  foreignField: "company_id"
});

companySchema.pre("remove", async function(next) {
  const company = this;
  await Station.deleteMany({ company_id: company._id });
  await Company.update(
    { children: { $in: [company._id] } },
    { $pull: { children: company._id } }
  );
  next();
});

companySchema.pre("updateOne", async function(next) {
  const company = await this.model.findOne(this.getQuery());
  const childId = mongoose.Types.ObjectId(this._update["$push"].children);
  const childCompany = await this.model.findOne({ _id: childId });

  if (!childCompany) throw new Error("Company Not Found");

  if (company.children.includes(childId))
    throw new Error("Already Owned By This Company!");

  const isCompanyHasOwner = await Company.find({
    children: { $in: [childId] }
  });

  if (isCompanyHasOwner.length > 0) throw new Error("Company Owned by");

  next();
});

const Company = mongoose.model("Company", companySchema, "Companies");

module.exports = Company;
