import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/authMiddleware.js";
import Order from "../models/orders.js"; // make sure to import your Order model
import Medicine from "../models/medicine.js";

// ✅ COD ORDER ROUTE (protected)
router.post("/cod", verifyToken, async (req, res) => {
  try {
    // ✅ get userId from decoded token, not frontend
    const userId = req.user.userId;
    const { items, totalPrice } = req.body;

    if (!items || items.length === 0 || !totalPrice) {
      return res
        .status(400)
        .json({ success: false, message: "Missing order details" });
    }

    // ✅ Save the order to MongoDB
    const newOrder = new Order({
      userId,
      totalPrice,
      status: "Pending",
    });
    await newOrder.save();

    // Optionally, reduce stockQuantity of each medicine
    for (const item of items) {
      await Medicine.findByIdAndUpdate(item._id, {
        $inc: { stockQuantity: -item.quantity },
      });
    }

    res.json({
      success: true,
      orderId: newOrder._id,
      message: "Order placed successfully!",
    });
  } catch (error) {
    console.error("❌ COD order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// 📌 GET all orders for logged-in user
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ userId })
      .sort({ date: -1 }) // newest first
      .select("-__v"); // clean response

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
