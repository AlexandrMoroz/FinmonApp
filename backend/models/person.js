const { Schema, model, models, Types } = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

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
      //required: true,
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

PersonSchema.plugin(mongoose_fuzzy_searching, {
  fields: [
    { name: "name", minSize: 2 },
    { name: "family", minSize: 2 },
    { name: "surname", minSize: 2 },
    { name: "INN", minSize: 10 },
  ],
});
module.exports = models["persons"] || model("persons", PersonSchema);
