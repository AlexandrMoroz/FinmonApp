const { Schema, model, Types } = require("mongoose");

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
    user:{
      type:String,
      required:true,
    },
    FormDataResultId: {
      type: Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = model("persons", PersonSchema);
