import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orders.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;

      console.log("✔ Payment confirmed for user:", userId);

      // Update order status
      await Order.findOneAndUpdate(
        { userId, status: "Pending" },
        { status: "Paid" }
      );

      // OPTIONAL: Clear cart in DB (if you ever store it)
      // await Cart.deleteMany({ userId });

      console.log("✔ Order updated to PAID");
    }

    res.json({ received: true });
  }
);

export default router;
