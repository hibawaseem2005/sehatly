// import React, { useContext } from "react";
// import Payment from "./payment";
// import { CartContext } from "../context/CartContext";
// import "./Checkout.css"; // 👈 import the CSS file

// function Checkout() {
//   const { cart, totalPrice } = useContext(CartContext);

//   return (
//     <div className="checkout-container">
//       <h2 className="checkout-title">🛒 Checkout</h2>

//       {cart.length === 0 ? (
//         <p className="empty-cart">Your cart is empty.</p>
//       ) : (
//         <>
//           <ul className="cart-list">
//             {cart.map((item) => (
//               <li key={item._id} className="cart-item">
//                 <div className="item-info">
//                   <span className="item-name">{item.name}</span>
//                   <span className="item-qty">x{item.quantity}</span>
//                 </div>
//                 <div className="item-price">
//                   ${item.price * item.quantity}
//                 </div>
//               </li>
//             ))}
//           </ul>

//           <div className="total-section">
//             <h3>Total:</h3>
//             <span className="total-amount">${totalPrice}</span>
//           </div>

//           <div className="payment-section">
//             <Payment
//               userId={localStorage.getItem("userEmail")} // ✅ get real logged-in user
//               token={localStorage.getItem("token")}
//               cartItems={cart}
//               totalPrice={totalPrice}
//             />

//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Checkout;
