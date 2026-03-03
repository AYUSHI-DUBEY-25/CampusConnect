const mongoose = require("mongoose");
const crypto = require("crypto");

const SubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    source: {
      type: String,
      default: "home",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    unsubscribeToken: {
      type: String,
    },
    meta: {
      ip: String,
      userAgent: String,
    },
  },
  { timestamps: true }
);
SubscriberSchema.pre("save", function (next) {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = crypto.randomBytes(32).toString("hex");
  }
  next();
});

module.exports = mongoose.model("Subscriber", SubscriberSchema);
