const { Schema, model } = require("mongoose");

const FOPFormDataSchema = new Schema(
  {
    result: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("FOPFormData", FOPFormDataSchema);
