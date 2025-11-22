import React, { useState, useEffect, useContext } from "react";
import "./MedicinesShop.css";
import { CartContext } from "./context/CartContext";
import { useNavigate } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


const MedicinesList = () => {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [prescriptionOnly, setPrescriptionOnly] = useState(false);
  const [category, setCategory] = useState("All");
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;


  const categoryMap = {
    All: null,
    Pain: "650000000000000000000004",
    Antibiotics: "650000000000000000000006",
    Fever: "650000000000000000000004",
    Allergy: "650000000000000000000008",
    Antidepressant: "650000000000000000000010",
    Diabetes: "650000000000000000000009",
    Hypertension: "650000000000000000000011",
    Asthma: "650000000000000000000012",
    Antifungal: "650000000000000000000013",
    Vaccine: "650000000000000000000014",
  };

  const carouselImages = [
    "/images/dawai.jpg",
    "/images/dawai2.jpg",
    "/images/vaccine.avif",
    "/images/cabinet.jpg",
    "/images/labcoat.jpg",
    "/images/dawai4.avif",
    "/images/seth.avif",
  ];

  const medicineFallback = "/images/dawai3.jpg";

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("http://localhost:5000/medicines");
        const data = await res.json();
        const medicinesWithImages = data.map((med) => ({
          ...med,
          image: med.image ? med.image : medicineFallback,
        }));
        setMedicines(medicinesWithImages);
      } catch (err) {
        console.error("❌ Error fetching medicines:", err);
      }
    };
    fetchMedicines();
  }, []);

  const filtered = medicines
    .filter((med) => med.name.toLowerCase().includes(search.toLowerCase())) //search filter ; this is required bcz searching is case sensitive
    .filter((med) => (prescriptionOnly ? med.req_prescription : true))// if checkbox is checked, filter for prescription meds only
    .filter((med) => {
      const selectedCatId = categoryMap[category];
      if (!selectedCatId) return true;
      return med.category_id?.toString() === selectedCatId;
    });//If category = All → show everything, Else compare medicine category_id with selectedCatId
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const handleAddToCart = (med) => {
    addToCart({
      _id: med._id || med.id || Date.now().toString(), //display any one of these -> the correct one 
      name: med.name,
      price: Number(med.price),
      brand: med.brand,
      quantity: 1,
    });
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    fade: true,
  };

  return (
    <div className="sehatly-root lavish-sectioned">
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-inner">
          
          <div className="top-contact">📞 (+1) 850 315 9426</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-left">
          <h1 className="hero-title">
            Your Medication <span className="accent">Now Made Easy</span>
          </h1>
          <p className="hero-sub">
            Quality-assured, fast delivery, trusted by thousands.
          </p>
          <button
            className="primary-cta"
            onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
          >
            Shop Now
          </button>
        </div>
        

        <div className="hero-right">
          <Slider {...carouselSettings} className="hero-slider">
            {carouselImages.map((img, i) => (
              <div key={i} className="hero-slide">
                <img src={img} alt={`slide-${i}`} className="hero-img" />
              </div>
            ))}
          </Slider>
        </div>
      </section>
      <section className="quick-links-section">
          <nav className="quick-links">
            <ul className="quick-links-list">
              <li>
                <a 
                  href="/about" 
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    navigate("/about"); // Navigate to About page
                  }}
                >
                  About
                </a>
              </li>

              <li>
                <a 
                  href="/contact" 
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    navigate("/contact"); // Navigate to Contact page
                  }}
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="/work-with-sehatly" 
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    navigate("/work-with-sehatly"); // Navigate to Work With Sehatly page
                  }}
                >
                  Work With Sehatly
                </a>
              </li>
            </ul>
          </nav>
        </section>

      {/* Category Pills */}
      <section className="category-strip">
        {Object.keys(categoryMap).map((cat) => (
          <button
            key={cat}
            className={`cat-pill ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Search bar below categories */}
      <div className="top-search" style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
        <input
          className="search-input"
          placeholder="Search medicines, brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>


      {/* Main Layout */}
      <div className="main-layout">
        <aside className="left-sidebar">
          <h3>Filters</h3>
          <label>
            <input
              type="checkbox"
              checked={prescriptionOnly}
              onChange={() => setPrescriptionOnly(!prescriptionOnly)}
            />
            Prescription required
          </label>
        </aside>

        <main className="products-area">
          <div className="products-header">
            <h3>Medicines</h3>
            <span className="count-badge">{filtered.length} items</span>
          </div>
          <div className="products-grid">
           {currentItems.map((med) => (
              <article key={med._id || med.id} className="product-card">
                {/* <img src={med.image} alt={med.name} className="product-img"/> */}
                <div className="card-body">
                  <h4>{med.name}</h4>
                  <p className="brand">{med.brand}</p>
                  <p className="desc">{med.description?.slice(0, 90)}</p>
                  <div className="card-bottom">
                    <div className="price">${Number(med.price).toFixed(2)}</div>
                    <button className="add-btn" onClick={() => handleAddToCart(med)}>Add</button>
                  </div>
                  {med.req_prescription && <div className="prescription-tag">Prescription</div>}
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? "active-page" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Sehatly — Trusted Online Pharmacy</p>
      </footer>
    </div>
  );
};

export default MedicinesList;
