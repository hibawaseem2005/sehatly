// routes/vendorRoutes.js
import express from "express";
import Medicine from "../models/medicine.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add new medicine (Vendor)
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { name, brand, category_id, price, stockQuantity, req_prescription } = req.body;
    const vendorId = req.user.userId; // taken from JWT

    const medicine = new Medicine({
      name,
      brand,
      category_id,
      price,
      stockQuantity,
      req_prescription,
      vendorId,
      addedAt: new Date(),
    });

    await medicine.save();
    res.json({ success: true, message: "Medicine added successfully!", medicine });
  } catch (err) {
    console.error("Error adding medicine:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get all medicines added by vendor
router.get("/my-medicines", verifyToken, async (req, res) => {
  try {
    const vendorId = req.user.userId;
    const medicines = await Medicine.find({ vendorId });
    res.json({ success: true, medicines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
