const { Schema, model, Types } = require("mongoose");
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');


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
PersonSchema.plugin(mongoose_fuzzy_searching, { fields: ['name', 'family','surname',"INN"] });

module.exports = model("persons", PersonSchema);
