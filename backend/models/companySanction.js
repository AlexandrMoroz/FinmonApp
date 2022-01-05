const { Schema, model, models } = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const CompanySanction = new Schema({
  name_original: {
    type: String,
  },
  name_ukr: {
    type: String,
    required: true,
  },
  odrn_edrpou: {
    type: String,
  },
  ipn: {
    type: String,
  },
});
CompanySanction.plugin(mongoose_fuzzy_searching, {
  fields: [
    { name: "name_original", minSize: 5 },
    { name: "name_ukr", minSize: 5 },
    { name: "odrn_edrpou", minSize: 4 },
    { name: "ipn", minSize: 4 }
  ],
});

module.exports =
  models["companySanction"] || model("companySanction", CompanySanction);
