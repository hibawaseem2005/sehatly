import React, { useState } from "react";
import { motion } from "framer-motion";
import "../designs/WorkWithSehatly.css";
import axios from "axios";

export default function WorkWithSehatly() {
  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    businessName: "",
    serviceType: "",
    city: "",
    website: "",
    donationAmount: "",
    volunteer: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRoleSelect = (selectedRole) => setRole(selectedRole);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false); // hide previous success
    setLoading(true);

    const minLoadingTime = 1500; // overlay minimum visible duration
    const startTime = Date.now();

    try {
      let response;
      if (role === "vendor") {
        response = await axios.post("http://localhost:5000/api/vendor/request", {
          name: form.name,
          email: form.email,
          phone: form.phone,
          businessName: form.businessName,
          serviceType: form.serviceType,
          city: form.city,
          website: form.website,
          message: form.message,
        });
      } else if (role === "donor") {
        response = await axios.post("http://localhost:5000/api/donations", {
          name: form.name,
          email: form.email,
          phone: form.phone,
          donationAmount: form.donationAmount,
          volunteer: form.volunteer,
          message: form.message,
        });
      }

      if (response.data.success) {
        setSuccess(true); // show success
        setTimeout(() => setSuccess(false), 3000); // hide after 3s
      }

      // reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        businessName: "",
        serviceType: "",
        city: "",
        website: "",
        donationAmount: "",
        volunteer: false,
      });
      setRole("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(minLoadingTime - elapsed, 0);
      setTimeout(() => setLoading(false), remainingTime); // ensure overlay visible for minLoadingTime
    }
  };

  return (
    <div className="work-page">
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loader"></div>
            <p>Your request is processing...</p>
          </div>
        </div>
      )}

      {/* Success Overlay */}
      {success && (
        <div className="success-overlay">
          <div className="success-content">
            ✔ Request submitted successfully!
          </div>
        </div>
      )}

      {/* HERO */}
      <motion.section
        className="work-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Work with <span className="accent">Sehatly</span></h1>
        <p>Do you want to join our mission? Become a vendor, volunteer, or donate today!</p>
      </motion.section>

      {/* ROLE SELECTION */}
      <motion.section
        className="role-selection"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Select how you want to contribute:</h2>
        <div className="role-buttons">
          <button
            className={role === "vendor" ? "selected" : ""}
            onClick={() => handleRoleSelect("vendor")}
          >
            Join as Vendor
          </button>
          <button
            className={role === "donor" ? "selected" : ""}
            onClick={() => handleRoleSelect("donor")}
          >
            Donate / Volunteer
          </button>
        </div>
      </motion.section>

      {/* FORM */}
      {role && (
        <motion.section
          className="work-form-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>{role === "vendor" ? "Vendor Registration" : "Volunteer / Donor Form"}</h2>
          <form className="work-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Your Phone Number"
              value={form.phone}
              onChange={handleChange}
            />

            {role === "vendor" && (
              <>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Business Name"
                  value={form.businessName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="serviceType"
                  placeholder="Type of Service"
                  value={form.serviceType}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="website"
                  placeholder="Website (optional)"
                  value={form.website}
                  onChange={handleChange}
                />
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Additional Information"
                  value={form.message}
                  onChange={handleChange}
                ></textarea>
              </>
            )}

            {role === "donor" && (
              <>
                <input
                  type="number"
                  name="donationAmount"
                  placeholder="Donation Amount (PKR)"
                  value={form.donationAmount}
                  onChange={handleChange}
                />
                <label className="volunteer-checkbox">
                  <input
                    type="checkbox"
                    name="volunteer"
                    checked={form.volunteer}
                    onChange={handleChange}
                  />
                  I want to volunteer
                </label>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Your Message or Notes"
                  value={form.message}
                  onChange={handleChange}
                ></textarea>
              </>
            )}

            <button type="submit">Submit Request</button>
          </form>
        </motion.section>
      )}
    </div>
  );
}
