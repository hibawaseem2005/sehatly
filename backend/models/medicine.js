import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  req_prescription: { type: Boolean, default: false }
});

// 👇 Make sure the collection name matches exactly: "medicines"
const Medicine = mongoose.model("Medicine", medicineSchema, "medicines");

export default Medicine;
