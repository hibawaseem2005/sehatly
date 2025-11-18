// routes/adminRoutes.js
import express from "express";
import Order from "../models/orders.js";
import Medicine from "../models/medicine.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all medicines (admin view)
router.get("/medicines", verifyToken, async (req, res) => {
  try {
    const meds = await Medicine.find();
    res.json({ success: true, total: meds.length, medicines: meds });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Basic analytics (sales, revenue, pending orders, etc.)
router.get("/analytics", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalprice || 0), 0);
    const pendingOrders = orders.filter(o => o.status === "pending").length;

    res.json({
      success: true,
      stats: {
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
