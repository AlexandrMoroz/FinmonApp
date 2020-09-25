const { Schema, model, Types } = require("mongoose");

const FOPSchema = new Schema(
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
      type: Number,
      required: true,
    },
    FormDataResultId: {
      type: Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("FOP", FOPSchema);
