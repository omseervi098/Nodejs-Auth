const mongoose = require("mongoose");
const forgetPassSchema = new mongoose.Schema(
  {
    //Reference to user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    accessToken: {
      type: String,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const forgotPass = mongoose.model("forgotPass", forgetPassSchema);
module.exports = forgotPass;
