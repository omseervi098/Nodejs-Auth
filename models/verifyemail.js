const mongoose = require("mongoose");
const verifyEmailSchema = new mongoose.Schema(
  {
    //Reference to user
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
      expires: 600,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const verifyEmail = mongoose.model("verifyEmail", verifyEmailSchema);
module.exports = verifyEmail;
