import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, default: "Pending" },
    totalPrice: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    customerInfo: {
      fullName: String,
      address: String,
      phone: String,
      riderMsg: String,
      pharmacyNote: String,
      deliveryETA: String,
    },
    date: { type: Date, default: Date.now }, // optional, can keep
  },
  { timestamps: true } // ← THIS IS THE KEY CHANGE
);

export default mongoose.model("Order", orderSchema);
