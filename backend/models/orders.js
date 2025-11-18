import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" }, // Pending, Paid, Delivered, Cancelled
  totalPrice: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  customerInfo: {
    fullName: { type: String },
    address: { type: String },
    phone: { type: String },
    riderMsg: { type: String },
    pharmacyNote: { type: String },
    deliveryETA: { type: String },
  },
});

export default mongoose.model("Order", orderSchema);
