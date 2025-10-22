const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: Number, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
