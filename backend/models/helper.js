const { Schema, model,models } = require("mongoose");

const Helper = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
  },
);

module.exports = models['helpers'] || model('helpers', Helper);

