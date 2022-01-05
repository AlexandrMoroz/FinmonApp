const { Schema, model, models } = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const PersonSanction = new Schema({
  name_ukr: {
    type: String,
    required: true,
  },
  name_original: {
    type: String,
  },
  birthdate: {
    type: Object,
  },
});
PersonSanction.plugin(mongoose_fuzzy_searching, {
  fields: [
    { name: "name_original", minSize: 4 },
    { name: "name_ukr", minSize: 4 },
    { name: "birthdate", minSize: 8 },
  ],
});

module.exports =
  models["personSanction"] || model("personSanction", PersonSanction);
