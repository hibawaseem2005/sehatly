import mongoose from "mongoose";

const vendorRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  businessName: { type: String, required: true },
  serviceType: String,
  city: String,
  website: String,
  message: String,
  status: { type: String, default: "pending" }, // pending, approved, rejected
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("VendorRequest", vendorRequestSchema);
