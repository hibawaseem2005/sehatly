import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/user.js";
import Order from "../models/order.js";
import Payment from "../models/payment.js";
import OrderDetail from "../models/orderDetail.js";
import Medicine from "../models/medicine.js";
import { io } from "../server.js";


const router = express.Router();

router.post("/cod", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT
    const { items, totalPrice, deliveryFee = 0, customer } = req.body;

    if (!items || items.length === 0 || !totalPrice) {
      return res.status(400).json({ success: false, message: "Missing order details" });
    }

    // Create order
    const order = await Order.create({
      userId,
      totalPrice,
      deliveryFee,
      status: "Pending",
      customerInfo: customer, // fullName, address, phone, riderMsg, pharmacyNote, deliveryETA
    });

    // Create payment record
    await Payment.create({
      order_id: order._id,
      paymentMethod: "COD",
      amount: totalPrice,
      status: "Pending",
      transaction_date: new Date(),
      provider: "Cash",
      provider_transaction_id: null,
    });

    // Create order details
    for (const item of items) {
      await OrderDetail.create({
        order_id: order._id,
        med_id: item._id,
        user_id: userId,
        unit_price: item.price,
        quantity: item.quantity,
      });

      // Reduce stock
      await Medicine.findByIdAndUpdate(item._id, { $inc: { stockQuantity: -item.quantity } });
    }
// Emit new order to admin dashboard
    io.emit("newOrder", {
      orderId: order._id,
      userId: userId,
      totalPrice,
      items,
      customer,
      status: order.status,
      createdAt: order.createdAt,
    });

    res.json({ success: true, orderId: order._id, message: "Order placed successfully!" });
  } catch (err) {
    console.error("COD order error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
