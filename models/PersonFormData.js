const { Schema, model } = require("mongoose");
const diffHistory = require('mongoose-diff-history/diffHistory');

const PeopleFormDataSchema = new Schema(
  {
    result: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);
PeopleFormDataSchema.plugin(diffHistory.plugin,{ omit: ['updateAt'] });

module.exports = model("PersonFormData", PeopleFormDataSchema);
