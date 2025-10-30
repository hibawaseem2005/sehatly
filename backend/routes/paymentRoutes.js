import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ Make sure your .env has STRIPE_SECRET_KEY
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment", async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    console.log("Received payment request:", { items, totalPrice });

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert dollars to cents
        },
        quantity: item.quantity,
      })),
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    console.log("✅ Stripe session created:", session.url);
    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe Checkout error:", error);
    res.status(500).json({ message: "Payment creation failed", error: error.message });
  }
});

export default router;
