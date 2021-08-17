const { Schema, model, Types, models } = require("mongoose");

const CompanySchema = new Schema(
  {
    shortName: {
      type: String,
      required: true,
    },
    clientCode: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    formDataResultId: {
      type: Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = models["Company"] || model("Company", CompanySchema);
