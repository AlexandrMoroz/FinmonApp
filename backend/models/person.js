const { Schema, model, models, Types } = require("mongoose");

const PersonSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    family: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
    },
    INN: {
      type: String,
      required: true,
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
module.exports = models["persons"] || model("persons", PersonSchema);
