import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51SM3slGg8Nbzb9Dv15yeTyg9NBiNiEdiqBDtyN4vI7b4rgFIGdEFeC47ZWs77nu9dQ9vH2uFvQ1AK2DrQQrTsgcj00K6IVjsN6"
);

const Payment = ({ userId, cartItems, totalPrice }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // default: card

  const handleCheckout = async () => {
    if (!userId) {
      alert("Please log in before placing an order.");
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod === "card") {
        // --- CARD PAYMENT ---
        const res = await fetch("http://localhost:5000/api/payments/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, items: cartItems, totalPrice }),
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url; // redirect to Stripe
        } else {
          alert("Error creating payment session. Please try again.");
        }

      } else if (paymentMethod === "cod") {
        // --- CASH ON DELIVERY ---
        const res = await fetch("http://localhost:5000/api/orders/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, items: cartItems, totalPrice }),
        });

        const data = await res.json();
        if (data.success) {
          alert("✅ Order placed successfully! Pay on delivery.");
        } else {
          alert("❌ Error placing order. Please try again.");
        }
      }
    } catch (err) {
      console.error("Error during checkout:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Total: ${totalPrice.toFixed(2)}</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Choose Payment Method</h3>
        <label style={{ marginRight: "20px" }}>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
          />{" "}
          Credit / Debit Card
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />{" "}
          Cash on Delivery (COD)
        </label>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "gray" : "#6772e5",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading
          ? "Processing..."
          : paymentMethod === "cod"
          ? "Confirm Order"
          : "Pay Now"}
      </button>
    </div>
  );
};

export default Payment;
