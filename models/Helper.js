const { Schema, model } = require("mongoose");

const Helper = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("helpers", Helper);
