import mongoose from "mongoose";

const orderDetailsSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

export default mongoose.model("OrderDetail", orderDetailsSchema);
