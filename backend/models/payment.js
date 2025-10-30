import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  paymentMethod: { type: String, required: true }, // e.g., "Stripe", "Cash on Delivery"
  amount: { type: Number, required: true },
  status: { type: String, default: "Pending" }, // Pending, Successful, Failed
  transactionDate: { type: Date, default: Date.now },
  provider: { type: String }, // Stripe, PayPal, etc.
  providerTransactionId: { type: String },
});

export default mongoose.model("Payment", paymentSchema);
