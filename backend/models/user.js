const { Schema, model, models } = require("mongoose");

const UserSchema = new Schema(
  {
    block:{
      type: Boolean,
      default:false
    },
    name: {
      type: String,
      required: true
    },
    family: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    cashboxAdress: {
      type: String,
    },
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin" ]
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = models['users'] || model("users", UserSchema);
