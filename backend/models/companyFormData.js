const { Schema, model,models } = require("mongoose");
const diffHistory = require("mongoose-diff-history/diffHistory");

const CompanyFormDataSchema = new Schema(
  {
    result: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);
CompanyFormDataSchema.plugin(diffHistory.plugin, { omit: ["updatedAt"] });
module.exports =
  models["CompanyFormData"] || model("CompanyFormData", CompanyFormDataSchema);
