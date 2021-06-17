const { Schema, model,models } = require("mongoose");
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

module.exports = models["form"]||model("form", Form);
