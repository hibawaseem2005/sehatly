import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on first render
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("sehatly_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sehatly_cart", JSON.stringify(cart));
  }, [cart]);

  // ---------------- ADD TO CART (same functionality) ----------------
  const addToCart = (medicine) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === medicine._id);

      if (existingItem) {
        return prevCart.map((item) =>
          item._id === medicine._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...medicine, quantity: 1 }];
      }
    });
  };

  // ---------------- REMOVE (same) ----------------
  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item._id !== id && item.id !== id)
    );
  };

  // ---------------- CLEAR CART (same) ----------------
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("sehatly_cart"); // also clear saved version
  };

  // ---------------- TOTAL PRICE (same) ----------------
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
  const updateQuantity = (id, newQty) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === id
          ? { ...item, quantity: newQty > 0 ? newQty : 1 }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalPrice, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
