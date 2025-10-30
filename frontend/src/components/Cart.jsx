// src/components/Cart.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Cart.css"; // optional, import the CSS you added

const Cart = () => {
  const { cart, removeFromCart, totalPrice, clearCart } = useContext(CartContext);

  if (!cart || cart.length === 0) {
    return <p className="cart-empty">Your cart is empty 🛍️</p>;
  }
  console.log("🧺 Cart items:", cart);

  return (
    <div className="cart-container">
      <h3>Your Cart</h3>

      {cart.map((item) => (
        <div key={item._id} className="cart-item">
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{item.name}</div>
            <div style={{ color: "#666", fontSize: "0.9rem" }}>{item.brand}</div>
          </div>

          <div style={{ textAlign: "right", minWidth: 120 }}>
            <div>${(item.price || 0).toFixed(2)} x {item.quantity}</div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => removeFromCart(item._id || item.id)}>Remove</button>
            </div>
          </div>
        </div>
      ))}


      <h4 style={{ textAlign: "right", marginTop: 16 }}>
        Total: ${ (totalPrice || 0).toFixed(2) }
      </h4>

      <button onClick={clearCart} style={{ marginTop: 14 }}>
        Clear Cart
      </button>
    </div>
  );
};

export default Cart;
