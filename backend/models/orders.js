import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" }, // Pending, Paid, Delivered, Cancelled
  totalPrice: { type: Number, required: true },
});

export default mongoose.model("Order", orderSchema);
