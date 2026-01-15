// models/Subscriber.js
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
      type: String, // where user subscribed from (e.g., "home", "event_page", "modal")
      default: "home",
    },
    verified: {
      type: Boolean,
      default: false, // set true when user clicks confirmation link (optional)
    },
    unsubscribeToken: {
      type: String, // secure token for one-click unsubscribe links
    },
    meta: {
      ip: String,
      userAgent: String,
    },
  },
  { timestamps: true }
);

// Pre-save: ensure an unsubscribe token exists
SubscriberSchema.pre("save", function (next) {
  if (!this.unsubscribeToken) {
    // 32 bytes hex -> 64 chars
    this.unsubscribeToken = crypto.randomBytes(32).toString("hex");
  }
  next();
});

module.exports = mongoose.model("Subscriber", SubscriberSchema);
