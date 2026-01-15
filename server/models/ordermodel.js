import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const OrderItemSchema = new Schema({
  event: { type: Types.ObjectId, ref: "Event" },
  name: String,
  date: Date,
  price: Number,
  qty: Number,
});

const OrderSchema = new Schema({
  items: [OrderItemSchema],
  payment: { type: Object, default: {} },
  buyer: { type: Types.ObjectId, ref: "User", required: true },
  totalAmount: { type: Number, default: 0 },
  status: { type: String, default: "Confirmed" },
}, { timestamps: true });

export default model("Order", OrderSchema);