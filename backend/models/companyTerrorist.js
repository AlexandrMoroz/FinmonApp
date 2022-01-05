const { Schema, model, models } = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const CompanyTerrorist = new Schema({
  name: {
    type: String,
    required: true,
  },
});
CompanyTerrorist.plugin(mongoose_fuzzy_searching, {
  fields: [{ name: "name", minSize: 5 }],
});

module.exports =
  models["companyTerrorist"] || model("companyTerrorist", CompanyTerrorist);
