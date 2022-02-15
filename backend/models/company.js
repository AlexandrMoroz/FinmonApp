const { Schema, model, Types, models } = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

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
CompanySchema.plugin(mongoose_fuzzy_searching, {
  fields: [
    { name: "shortName", minSize: 4 },
    { name: "clientCode", minSize: 5 },
  ],
});

module.exports = models["Company"] || model("Company", CompanySchema);
