const mongoose = require("mongoose");
const path = require("path");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      //select: false,
      encrypt: true,
    },
    name: {
      type: String,
      lowercase: true,
      capitalize: true,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
