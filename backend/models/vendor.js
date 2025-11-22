import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  companyName: String,
  phone: String,
  password: String, // hashed password
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Vendor", vendorSchema);
