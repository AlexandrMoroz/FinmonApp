const { Schema, model,models } = require("mongoose");
const diffHistory = require("mongoose-diff-history/diffHistory");

const PeopleFormDataSchema = new Schema(
  {
    result: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);
PeopleFormDataSchema.plugin(diffHistory.plugin, { omit: ["updatedAt"] });

module.exports =
  models["PersonFormData"] || model("PersonFormData", PeopleFormDataSchema);
