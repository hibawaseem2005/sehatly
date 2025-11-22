import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../designs/VendorLogin.css"; // Teal-Blue gradient CSS

export default function VendorLogin() {
  // Form state starts empty to avoid pre-filled values
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { email, password } = form;
      const res = await axios.post("http://localhost:5000/api/vendor/login", { email, password });

      if (res.data.success) {
        localStorage.setItem("vendorToken", res.data.token);
        alert("✅ Login successful!");
        // Reset form after successful login
        setForm({ email: "", password: "" });
        window.location.href = "/vendor/dashboard";
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid credentials!");
      // Reset password field only
      setForm({ ...form, password: "" });
    }
    setLoading(false);
  };

  return (
    <div className="vendor-login-page">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="login-title">Vendor Login</h2>
        <form
          className="login-form"
          onSubmit={handleSubmit}
          autoComplete="off" // Prevent browser autofill
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
