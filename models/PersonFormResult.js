const { Schema, model } = require("mongoose");
const diffHistory = require('mongoose-diff-history/diffHistory');

const PeopleFormResultSchema = new Schema(
  {
    result: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);
PeopleFormResultSchema.plugin(diffHistory.plugin);

module.exports = model("peopleFormResults", PeopleFormResultSchema);
