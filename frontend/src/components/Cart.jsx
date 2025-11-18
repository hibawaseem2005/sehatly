import React, { useContext, useState, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./cart1.css";

export default function Cart() {
  // expected from CartContext: cart (array), removeFromCart(id), totalPrice (number), clearCart(), updateQuantity(id, qty)
  const { cart, removeFromCart, totalPrice, clearCart, updateQuantity } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);

  // Stepper
  const [step, setStep] = useState(1); // 1: Items, 2: Delivery, 3: Payment, 4: Summary

  // Checkout state
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(null); // { code, percent }

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [riderMsg, setRiderMsg] = useState("");
  const [pharmacyNote, setPharmacyNote] = useState("");
  const [deliveryInstruction, setDeliveryInstruction] = useState("Leave at door");
  const [saveAddress, setSaveAddress] = useState(false);

  const [deliveryETA, setDeliveryETA] = useState("40 minutes");

  // Prescription file (local preview)
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const presRef = useRef();

  const deliveryFees = {
    "20 minutes": 5,
    "30 minutes": 3,
    "40 minutes": 0,
    "50 minutes": 0,
  };

  const promoDiscountPercent = promoApplied ? promoApplied.percent : 0;
  const subtotal = Number(totalPrice || 0);
  const subtotalAfterPromo = subtotal * (1 - promoDiscountPercent / 100);
  const totalWithDelivery = subtotalAfterPromo * 1.05 + (deliveryFees[deliveryETA] || 0);

  // Safely call updateQuantity if available
  const changeQty = (id, newQty) => {
    if (!updateQuantity || typeof updateQuantity !== "function") {
      // graceful fallback: alert small UI hint
      alert(
        "Quantity update is not enabled. Add `updateQuantity(id, qty)` to your CartContext provider to enable quantity changes."
      );
      return;
    }
    const qty = Number(newQty);
    if (isNaN(qty) || qty < 1) return;
    updateQuantity(id, qty);
  };

  // promo codes (example)
  const tryApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return alert("Enter promo code");
    // example codes
    if (code === "MED10") {
      setPromoApplied({ code, percent: 10 });
      alert("Promo applied: 10% off");
    } else if (code === "SAVE5") {
      setPromoApplied({ code, percent: 5 });
      alert("Promo applied: 5% off");
    } else {
      setPromoApplied(null);
      alert("Invalid promo code");
    }
  };

  const removePrescription = () => {
    setPrescriptionFile(null);
    if (presRef.current) presRef.current.value = "";
  };

  // Step navigation
  const nextStep = () => {
    if (step === 1 && cart.length === 0) return;
    setStep((s) => Math.min(4, s + 1));
  };
  const prevStep = () => setStep((s) => Math.max(1, s - 1));
  const goToStep = (s) => setStep(s);

  const handleCheckout = async () => {
    if (!user || !token) {
      alert("Please log in before placing an order.");
      return;
    }
    // Basic validation
    if (!fullName || !address || !phone) {
      alert("Please complete name, address and phone.");
      setStep(2);
      return;
    }

    setLoading(true);

    const payload = {
      items: cart.map((item) => ({
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
      totalPrice: Number(totalWithDelivery.toFixed(2)),
      deliveryFee: deliveryFees[deliveryETA] || 0,
      customer: {
        fullName,
        email,
        address,
        city,
        phone,
        emergencyContact,
        riderMsg,
        pharmacyNote,
        deliveryInstruction,
        deliveryETA,
        saveAddress,
      },
      promo: promoApplied,
      hasPrescription: !!prescriptionFile,
    };

    try {
      if (paymentMethod === "card") {
        const res = await fetch("http://localhost:5000/api/payments/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else alert("Payment failed.");
      } else {
        const res = await fetch("http://localhost:5000/api/orders/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success) {
          alert("Order placed successfully.");
          clearCart();
          setStep(4);
        } else alert("COD order failed");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout error");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return <p className="cart-empty">Your cart is empty — add some medicines to continue.</p>;
  }

  return (
    <div className="checkout-page stepper-page">
      <div className="checkout-container">
        {/* LEFT: main content (steps) */}
        <div className="left-panel">
          <div className="stepper-header">
            <div className={`step ${step >= 1 ? "active" : ""}`} onClick={() => goToStep(1)}>
              <div className="step-num">1</div>
              <div className="step-label">Medicines</div>
            </div>
            <div className={`step ${step >= 2 ? "active" : ""}`} onClick={() => goToStep(2)}>
              <div className="step-num">2</div>
              <div className="step-label">Delivery</div>
            </div>
            <div className={`step ${step >= 3 ? "active" : ""}`} onClick={() => goToStep(3)}>
              <div className="step-num">3</div>
              <div className="step-label">Payment</div>
            </div>
            <div className={`step ${step >= 4 ? "active" : ""}`} onClick={() => goToStep(4)}>
              <div className="step-num">4</div>
              <div className="step-label">Summary</div>
            </div>
          </div>

          {/* STEP 1 - Medicines */}
          {step === 1 && (
            <section className="step-panel">
              <h2 className="panel-title">Your Medicines</h2>

              <div className="cards-grid">
                {cart.map((item) => (
                  <div key={item._id} className="med-card">
                    <div className="med-thumb" />
                    <div className="med-main">
                      <div className="med-title">{item.name}</div>
                      <div className="med-sub">Category: Medicine</div>
                      <div className="med-meta">
                        <div className="price">${item.price.toFixed(2)}</div>
                        <div className="qty-controls">
                          <button
                            className="qty-btn"
                            onClick={() => changeQty(item._id, Number(item.quantity) - 1)}
                          >
                            −
                          </button>
                          <div className="qty-value">{item.quantity}</div>
                          <button
                            className="qty-btn"
                            onClick={() => changeQty(item._id, Number(item.quantity) + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="med-actions">
                      <button className="remove-small" onClick={() => removeFromCart(item._id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="step-actions">
                <button className="secondary" onClick={() => clearCart()}>
                  Clear Cart
                </button>
                <button className="primary" onClick={nextStep}>
                  Continue to Delivery →
                </button>
              </div>
            </section>
          )}

          {/* STEP 2 - Delivery */}
          {step === 2 && (
            <section className="step-panel">
              <h2 className="panel-title">Delivery & Contact</h2>

              <div className="form-grid">
                <label>
                  Full Name
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </label>
                <label>
                  Email
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                  Phone
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
                <label>
                  Emergency Contact
                  <input type="text" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
                </label>
                <label className="full">
                  Address
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                </label>
                <label>
                  City
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                </label>

                <label>
                  Delivery Instructions
                  <select value={deliveryInstruction} onChange={(e) => setDeliveryInstruction(e.target.value)}>
                    <option>Leave at door</option>
                    <option>Hand it over personally</option>
                    <option>Deliver to reception</option>
                    <option>Call on arrival</option>
                  </select>
                </label>

                <label>
                  Delivery ETA
                  <select value={deliveryETA} onChange={(e) => setDeliveryETA(e.target.value)}>
                    <option value="20 minutes">20 minutes (+$5)</option>
                    <option value="30 minutes">30 minutes (+$3)</option>
                    <option value="40 minutes">40 minutes</option>
                    <option value="50 minutes">50 minutes</option>
                  </select>
                </label>

                <label className="full">
                  Message for Rider
                  <textarea value={riderMsg} onChange={(e) => setRiderMsg(e.target.value)} />
                </label>

                <label className="full">
                  Prescription (optional)
                  <div className="pres-upload">
                    <input
                      ref={presRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                    />
                    {prescriptionFile && (
                      <div className="pres-preview">
                        <small>{prescriptionFile.name}</small>
                        <button className="link" onClick={removePrescription} type="button">
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </label>

                <label className="full checkbox">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                  Save this address for future orders
                </label>
              </div>

              <div className="step-actions">
                <button className="secondary" onClick={prevStep}>
                  ← Back
                </button>
                <button className="primary" onClick={nextStep}>
                  Continue to Payment →
                </button>
              </div>
            </section>
          )}

          {/* STEP 3 - Payment */}
          {step === 3 && (
            <section className="step-panel">
              <h2 className="panel-title">Payment</h2>

              <div className="payment-grid">
                <div className="radio-grid">
                  <label className={`radio-card ${paymentMethod === "card" ? "checked" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <div className="radio-body">
                      <div className="radio-title">Credit / Debit Card</div>
                      <div className="radio-sub">Secure card payment via Stripe</div>
                    </div>
                  </label>

                  <label className={`radio-card ${paymentMethod === "cod" ? "checked" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <div className="radio-body">
                      <div className="radio-title">Cash on Delivery</div>
                      <div className="radio-sub">Pay the rider when they deliver</div>
                    </div>
                  </label>
                </div>

                <div className="promo-box">
                  <input
                    placeholder="Promo code (e.g. MED10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button onClick={tryApplyPromo}>Apply</button>
                  {promoApplied && <small className="applied">Applied: {promoApplied.code} - {promoApplied.percent}%</small>}
                </div>

                <label className="full">
                  Special Note for Pharmacy
                  <textarea value={pharmacyNote} onChange={(e) => setPharmacyNote(e.target.value)} />
                </label>
              </div>

              <div className="step-actions">
                <button className="secondary" onClick={prevStep}>
                  ← Back
                </button>
                <button className="primary" onClick={() => setStep(4)}>
                  Review Order →
                </button>
              </div>
            </section>
          )}

          {/* STEP 4 - Summary */}
          {step === 4 && (
            <section className="step-panel">
              <h2 className="panel-title">Order Summary</h2>

              <div className="summary-panel">
                <div className="summary-left">
                  <h4>Items</h4>
                  {cart.map((item) => (
                    <div key={item._id} className="summary-item">
                      <div>
                        <strong>{item.name}</strong> × {item.quantity}
                        <div className="muted">Price: ${item.price.toFixed(2)}</div>
                      </div>
                      <div className="summary-item-right">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="summary-right">
                  <div className="summary-row">
                    <div>Subtotal</div>
                    <div>${subtotal.toFixed(2)}</div>
                  </div>
                  {promoApplied && (
                    <div className="summary-row">
                      <div>Promo ({promoApplied.code})</div>
                      <div>-{promoApplied.percent}%</div>
                    </div>
                  )}
                  <div className="summary-row">
                    <div>Delivery</div>
                    <div>${(deliveryFees[deliveryETA] || 0).toFixed(2)}</div>
                  </div>
                  <div className="summary-row total">
                    <div>Total</div>
                    <div>${totalWithDelivery.toFixed(2)}</div>
                  </div>

                  <div className="summary-actions">
                    <button className="secondary" onClick={prevStep}>← Back</button>
                    <button className="primary" onClick={handleCheckout} disabled={loading}>
                      {loading ? "Processing..." : paymentMethod === "card" ? "Pay & Checkout" : "Place COD Order"}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* RIGHT: sticky mini cart / quick summary */}
        <aside className="right-panel">
          <div className="mini-header">
            <h3>Quick Summary</h3>
            <small>{cart.length} items</small>
          </div>

          <div className="mini-list">
            {cart.map((it) => (
              <div key={it._id} className="mini-item">
                <div className="mini-thumb" />
                <div className="mini-info">
                  <div className="mini-name">{it.name}</div>
                  <div className="muted">Qty: {it.quantity}</div>
                </div>
                <div className="mini-price">${(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="mini-totals">
            <div className="mini-row"><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></div>
            {promoApplied && <div className="mini-row"><span>Promo</span><b>-{promoApplied.percent}%</b></div>}
            <div className="mini-row"><span>Delivery</span><b>${(deliveryFees[deliveryETA] || 0).toFixed(2)}</b></div>
            <div className="mini-row total"><span>Total</span><b>${totalWithDelivery.toFixed(2)}</b></div>
          </div>

          <div className="mini-actions">
            <button className="primary full" onClick={() => goToStep(4)}>Review & Checkout</button>
            <button className="secondary full" onClick={() => goToStep(1)}>Edit Items</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
