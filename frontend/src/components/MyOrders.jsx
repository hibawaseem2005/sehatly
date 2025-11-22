import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../designs/MyOrders.css"; // we'll create a separate CSS file

export default function MyOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { if (data.success) setOrders(data.orders); })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return <p>Please login to view your orders.</p>;
  if (loading) return <p>Loading your orders...</p>;

  return (
    <div className="orders-page">
      <h2 className="page-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="empty-message">You have no orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((o) => (
            <div className="order-card" key={o._id}>
              <div className="order-header">
                <span><strong>Order ID:</strong> {o._id}</span>
                <span className={`order-status ${o.status.toLowerCase()}`}>{o.status}</span>
              </div>

              <div className="order-info">
                <span><strong>Date:</strong> {new Date(o.date).toLocaleString()}</span>
                <span><strong>Total:</strong> ${o.totalPrice}</span>
              </div>

              {/* <div className="order-items">
                <strong>Items:</strong>
                {(!o.items || o.items.length === 0) ? (
                  <p className="no-items">No items found for this order.</p>
                ) : (
                  <ul className="items-list">
                    {o.items.map((item, index) => (
                      <li key={index} className="item-card">
                        {item.image && <img src={item.image} alt={item.name} />}
                        <div className="item-details">
                          <p className="item-name">{item.name}</p>
                          <p className="item-qty-price">Qty: {item.quantity} | ${item.price}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
