import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Stripe from "stripe";
import Order from "../models/orders.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe payment route
router.post("/create-payment", verifyToken, async (req, res) => {
  try {
    console.log("POST /api/payments/create-payment hit");

    const userId = req.user.userId;
    const { items, totalPrice } = req.body;

    if (!items || items.length === 0 || !totalPrice) {
      return res.status(400).json({ success: false, message: "Missing order details" });
    }

    console.log("Items:", items);
    console.log("Total price:", totalPrice);

    // Prepare Stripe line items
    const lineItems = items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name || "Unnamed Product" },
        unit_amount: Math.round(Number(item.price) * 100), // ensure integer
      },
      quantity: Number(item.quantity),
    }));

    console.log("Line items for Stripe:", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: { userId },
    });

    // Save pending order
    const newOrder = new Order({ userId, totalPrice, status: "Pending" });
    await newOrder.save();

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
