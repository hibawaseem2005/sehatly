import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Truck, ShieldCheck, Phone, Users, Star, HelpCircle, ChevronDown } from "lucide-react";
import insideImage from "../sehatly-images/inside-sehatly.jpg";
import insideImage2 from "../sehatly-images/inside-sehatly-2.jpg";
import insideImage3 from "../sehatly-images/inside-sehatly-3.jpg";
import insideImage4 from "../sehatly-images/inside-sehatly-4.jpg";
import aboutUs from "../sehatly-images/about-us.png";
import pills from "../sehatly-images/pills.jpg";

import "../designs/About.css";

const AccordionItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`accordion-item ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
      <div className="accordion-title">
        <div className="accordion-icon"><HelpCircle size={20} /></div>
        <h4>{question}</h4>
        <ChevronDown className="chev" />
      </div>
      <div className="accordion-content">
        <p>{answer}</p>
      </div>
    </div>
  );
};

const About = () => {
  const faqs = [
    { q: "Are your medicines authentic?", a: "Yes — we source from licensed distributors and perform regular quality checks." },
    { q: "How fast is delivery?", a: "Most orders are delivered within 1–3 hours in covered cities. We show estimated delivery time on checkout." },
    { q: "Can I return medicines?", a: "If a product is damaged or incorrect, contact support within 48 hours and we'll handle the return and replacement." },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero fancy-gradient-bg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="about-hero-text"
        >
          <h1>
            Welcome to <span className="accent">Sehatly</span>
          </h1>
          <p>
            Pakistan’s modern digital pharmacy — fast delivery, verified medicines,
            and customer care that truly listens.
          </p>
          <div className="hero-ctas">
            <button className="primary-cta">Shop Now</button>
            <button className="secondary-cta">Learn More</button>
          </div>
        </motion.div>
        <motion.img
          src={pills}
          alt="Medicines Delivery"
          className="about-hero-img"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        />
      </section>

      {/* Animated Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          {[ 
            { number: "50,000+", label: "Medicines Delivered" },
            { number: "15,000+", label: "Happy Customers" },
            { number: "100%", label: "Verified Products" },
            { number: "24/7", label: "Support" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <section className="our-story enhanced-section">
        <h2>How Sehatly Began</h2>
        <div className="story-content">
          <img src={aboutUs} alt="Our Story" />
          <p>
            Sehatly started with a mission to reshape the healthcare experience in Pakistan.
            From emergency medicines to daily wellness products — we ensure everything
            reaches you on time with guaranteed authenticity.
          </p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="mission-vision fancy-border-section">
        <div>
          <h2>Our Mission</h2>
          <p>
            To make healthcare accessible for everyone by offering an effortless,
            modern, and trustworthy online pharmacy experience.
          </p>
        </div>
        <div>
          <h2>Our Vision</h2>
          <p>
            To become Pakistan's most reliable and innovative healthcare platform,
            bridging technology with compassion.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <h2>Why People Trust Sehatly</h2>
        <div className="features-grid">
          <div className="feature-card"><CheckCircle size={42} /><h3>Authentic Medicines</h3><p>Only sourced from approved distributors and verified suppliers.</p></div>
          <div className="feature-card"><Truck size={42} /><h3>Fast Delivery</h3><p>Quick and safe delivery at your doorstep.</p></div>
          <div className="feature-card"><ShieldCheck size={42} /><h3>Secure & Reliable</h3><p>Your health information and data are always protected.</p></div>
          <div className="feature-card"><Phone size={42} /><h3>24/7 Support</h3><p>Our team is always here to assist you.</p></div>
        </div>
      </section>

      {/* New Section – Timeline */}
      <section className="timeline-section">
        <h2>Our Journey</h2>
        <div className="timeline">
          <div className="timeline-item"><span>2022</span><p>Sehatly was founded with a mission to simplify healthcare.</p></div>
          <div className="timeline-item"><span>2023</span><p>Expanded delivery coverage to major cities across Pakistan.</p></div>
          <div className="timeline-item"><span>2024</span><p>Launched new customer support and instant-order system.</p></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card"><Star size={32} /><p>“Fast delivery and genuine products. My go-to online pharmacy!”</p><h4>- Ayesha</h4></div>
          <div className="testimonial-card"><Star size={32} /><p>“Customer support is amazing. They actually care.”</p><h4>- Ahmed</h4></div>
          <div className="testimonial-card"><Star size={32} /><p>“Super smooth ordering process. Highly recommended!”</p><h4>- Fatima</h4></div>
        </div>
      </section>

      {/* FAQ Section (now interactive accordion) */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqs.map((f, i) => (
            <AccordionItem key={i} question={f.q} answer={f.a} />
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="about-gallery">
        <h2>Inside Sehatly</h2>
        <div className="gallery-grid">
          <img src={insideImage} alt="Warehouse" />
          <img src={insideImage2} />
          <img src={insideImage3} alt="Packaging" />
          <img src={insideImage4} alt="Delivery" />
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <p>Experience healthcare the modern way — quick, safe, and reliable.</p>
        <button className="primary-cta" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Shop Now
        </button>
      </section>
    </div>
  );
};

export default About;