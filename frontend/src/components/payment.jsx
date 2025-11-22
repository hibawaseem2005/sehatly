// // src/components/payment.js
// import React from "react";
// import { loadStripe } from "@stripe/stripe-js";

// // Initialize Stripe
// const stripePromise = loadStripe(
//   "pk_test_51SM3slGg8Nbzb9Dv15yeTyg9NBiNiEdiqBDtyN4vI7b4rgFIGdEFeC47ZWs77nu9dQ9vH2uFvQ1AK2DrQQrTsgcj00K6IVjsN6"
// );

// // -------------------------
// //   Checkout Function
// // -------------------------

// export const checkout = async ({
//   user,
//   token,
//   cartItems,
//   totalPrice,
//   paymentMethod
// }) => {
//   if (!user || !token) {
//     alert("⚠️ Please log in before placing an order.");
//     return;
//   }

//   if (!cartItems || cartItems.length === 0) {
//     alert("🛒 Your cart is empty!");
//     return;
//   }

//   try {
//     if (paymentMethod === "card") {
//       // Stripe payment
//       const res = await fetch("http://localhost:5000/api/payments/create-payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ email: user.email, items: cartItems, totalPrice }),
//       });

//       const data = await res.json();
//       if (data.url) window.location.href = data.url;
//       else alert("❌ Payment failed. Please try again.");
//     } else {
//       // Cash on Delivery
//       const res = await fetch("http://localhost:5000/api/orders/cod", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           email: user.email,
//           items: cartItems.map(i => ({
//             _id: i._id,
//             quantity: i.quantity,
//             price: i.price,
//           })),
//           totalPrice,
//         }),
//       });

//       const data = await res.json();
//       if (data.success) alert(`✅ Order placed! Order ID: ${data.orderId}`);
//       else alert("❌ COD order failed: " + (data.message || ""));
//     }
//   } catch (err) {
//     console.error("Checkout error:", err);
//     alert("Something went wrong. Please try again.");
//   }
// };

// // -------------------------
// //   React Payment Button
// // -------------------------

// export default function Payment({ userId, token, cartItems, totalPrice }) {
//   return (
//     <button
//       onClick={() =>
//         checkout({
//           user: { email: userId },
//           token,
//           cartItems,
//           totalPrice,
//           paymentMethod: "card", // default payment method
//         })
//       }
//       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//     >
//       Pay Now
//     </button>
//   );
// }
