const { Schema, model } = require("mongoose");

const FOPFormResultSchema = new Schema(
  {
    result: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("FOPFormResults", FOPFormResultSchema);
