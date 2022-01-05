const { Schema, model, models } = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const PersonTerrorist = new Schema({
  name: {
    type: String,
    required: true,
  },
});
PersonTerrorist.plugin(mongoose_fuzzy_searching, {
  fields: [{ name: "name", minSize: 5 }],
});

module.exports =
  models["personTerrorist"] || model("personTerrorist", PersonTerrorist);
