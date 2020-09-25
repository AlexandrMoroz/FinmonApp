const { Schema, model } = require("mongoose");
/**
 * @Desc content must contains label text and value
 */
const Form = new Schema({
  name: {
    type: String,
    require: true,
  },
  content: {
    type: Object,
    required: true,
  },
});

module.exports = model("form", Form);
