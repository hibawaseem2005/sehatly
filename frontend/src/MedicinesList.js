import React, { useState, useEffect, useContext } from "react";
import "./MedicinesShop.css";
import { CartContext } from "./context/CartContext"; // import cart context

const MedicinesList = () => {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [prescriptionOnly, setPrescriptionOnly] = useState(false);
  const [category, setCategory] = useState("All");

  const { addToCart } = useContext(CartContext); // get addToCart function

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("http://localhost:5000/medicines");
        const data = await res.json();
        setMedicines(data);
      } catch (err) {
        console.error("❌ Error fetching medicines:", err);
      }
    };
    fetchMedicines();
  }, []);

  // 🔍 Filtering logic
  const filtered = medicines
    .filter((med) => med.name.toLowerCase().includes(search.toLowerCase()))
    .filter((med) => (prescriptionOnly ? med.req_prescription : true))
    .filter((med) =>
      category === "All" ? true : med.category?.includes(category)
    );

  // 🛒 Add medicine to cart
    const handleAddToCart = (med) => {
      addToCart({
        _id: med._id || med.id || Date.now().toString(), // ✅ always have one
        name: med.name,
        price: Number(med.price),
        brand: med.brand,
        quantity: 1,
      });
    };


  return (
    <div className="shop-container">
      {/* Header */}
      <header className="shop-header">
        <div className="logo">💊 Sehatly</div>
        <div className="search-bar">
          <input
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>🔍</button>
        </div>
      </header>

      {/* Main layout */}
      <div className="shop-layout">
        {/* Sidebar */}
        <aside className="shop-sidebar">
          <h3>Categories</h3>
          {["All", "Pain Relief", "Vitamins", "Cough & Cold", "Skincare", "Diabetes"].map(
            (cat) => (
              <button
                key={cat}
                className={`cat-btn ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            )
          )}
          <div className="filters">
            <label>
              <input
                type="checkbox"
                checked={prescriptionOnly}
                onChange={() => setPrescriptionOnly(!prescriptionOnly)}
              />{" "}
              Prescription required
            </label>
          </div>
        </aside>

        {/* Products */}
        <section className="shop-products">
          <div className="products-header">
            <h3>Medicines</h3>
            <span>{filtered.length} items</span>
          </div>

          <div className="products-grid">
            {filtered.map((med) => (
              <div key={med._id} className="product-card">
                <div className="product-img">
                  <img
                    src="https://via.placeholder.com/180x140?text=Medicine"
                    alt={med.name}
                  />
                </div>
                <h4>{med.name}</h4>
                <p className="brand">{med.brand}</p>
                <p className="description">{med.description}</p>

                <div className="price-row">
                  <span className="price">${med.price}</span>
                  <button
                    className="btn-primary"
                    onClick={() => handleAddToCart(med)}
                  >
                    Add
                  </button>
                </div>

                {med.req_prescription && (
                  <span className="prescription-badge">Prescription</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MedicinesList;
