import React, { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import "../designs/AddMedicine.css";

const AddMedicine = () => {
  const categories = {
    "Pain Relief": "650000000000000000000004",
    Antibiotics: "650000000000000000000006",
    Fever: "650000000000000000000007",
    Allergy: "650000000000000000000008",
    Diabetes: "650000000000000000000009",
    "Anti Depressants": "650000000000000000000010",
    Hypertension: "650000000000000000000011",
    Asthma: "650000000000000000000012",
    Antifungal: "650000000000000000000013",
    Vaccines: "650000000000000000000014",
  };

  const [recentlyAdded, setRecentlyAdded] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    category_id: "",
    price: "",
    discount: "",
    stockQuantity: "",
    req_prescription: false, // Added field
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_id) {
      alert("Please select a category!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first!");
        return;
      }

      const res = await fetch("http://localhost:5000/api/medicines/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setRecentlyAdded(data.medicine);

        setFormData({
          name: "",
          brand: "",
          description: "",
          category_id: "",
          price: "",
          discount: "",
          stockQuantity: "",
          req_prescription: false,
        });
      } else alert("Error: " + data.message);
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="add-page">
      <aside className="sidebar sleek-sidebar">
        <h2 className="sidebar-logo">Sehatly</h2>
        <ul>
          <li className="active-item">Dashboard</li>
          <li>My Medicines</li>
          <li>Settings</li>
        </ul>
      </aside>

      <div className="content-area">
        <header className="top-header">
          <h1>Add New Medicine</h1>
          <div className="user-icon">VP</div>
        </header>

        <div className="form-layout">
          <form className="form-card" onSubmit={handleSubmit}>
            <h2 className="section-head">General Information</h2>

            <div className="input-grid">
              <div>
                <label>Medicine Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div>
                <label>Brand</label>
                <input name="brand" value={formData.brand} onChange={handleChange} required />
              </div>
            </div>

            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />

            {/* Prescription checkbox */}
            <div className="checkbox-wrapper">
              <label>
                <input
                  type="checkbox"
                  name="req_prescription"
                  checked={formData.req_prescription}
                  onChange={handleChange}
                />
                Requires Prescription
              </label>
            </div>

            <h2 className="section-head">Pricing & Stock</h2>

            <div className="input-grid">
              <div>
                <label>Price (Rs.)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
              </div>

              <div>
                <label>Discount (%)</label>
                <input type="number" name="discount" value={formData.discount} onChange={handleChange} />
              </div>

              <div>
                <label>Stock Quantity</label>
                <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required />
              </div>
            </div>

            <h2 className="section-head">Category</h2>
            <div className="dropdown-wrapper">
              <select name="category_id" value={formData.category_id} onChange={handleChange}>
                <option value="">Choose Category</option>
                {Object.entries(categories).map(([name, id]) => (
                  <option value={id} key={id}>{name}</option>
                ))}
              </select>
              <ChevronDown className="icon" />
            </div>

            <button className="submit-btn"><Plus /> Add Medicine</button>
          </form>

          {recentlyAdded && (
            <div className="preview-card">
              <h3>Recently Added</h3>
              <p><strong>{recentlyAdded.name}</strong></p>
              <p>{recentlyAdded.brand}</p>
              <p>Rs. {recentlyAdded.price}</p>
              <p>{recentlyAdded.req_prescription ? "Prescription Required" : "No Prescription"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMedicine;
