// routes/adminRoutes.js
import express from "express";
import Order from "../models/orders.js";
import Medicine from "../models/medicine.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.role !== "admin") return res.status(403).json({ message: "Not an admin" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
