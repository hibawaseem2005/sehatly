import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // new
  stockQuantity: { type: Number, required: true },
  req_prescription: { type: Boolean, default: false },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  image: { type: String, default: null }, // new
  addedAt: { type: Date, default: Date.now }
});

medicineSchema.index({ vendorId: 1, category_id: 1 });

const Medicine = mongoose.model("Medicine", medicineSchema, "medicines");
export default Medicine;
