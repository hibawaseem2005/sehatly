import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, X } from "lucide-react";
import { motion } from "framer-motion";
import "../designs/Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [mapRevealed, setMapRevealed] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };
    const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! How can we help you today?" }
    ]);
    const [input, setInput] = useState("");

    const predefinedAnswers = {
    "what are your hours": "Our support hours are Monday–Friday 9am–10pm, Saturday–Sunday 10am–8pm.",
    "where are you located": "We are located in Karachi, Pakistan.",
    "how can i contact support": "You can reach us by phone at +92 300 1234567 or email support@sehatly.pk."
    };

    const handleSend = () => {
    if (!input.trim()) return;

    // add user message
    setMessages((prev) => [...prev, { type: "user", text: input }]);

    // auto-answer if matches predefined
    const answer = predefinedAnswers[input.toLowerCase()] || "Sorry, I didn't understand that. Try one of: 'what are your hours', 'where are you located', 'how can i contact support'.";
    setMessages((prev) => [...prev, { type: "bot", text: answer }]);

    setInput("");
    };


  return (
    <div className="contact-page">

      {/* HERO */}
      <motion.section
        className="contact-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>
          Get in <span className="accent">Touch</span>
        </h1>
        <p>We’re here to help! Reach out anytime and our team will get back to you.</p>
      </motion.section>

      {/* CONTACT INFO */}
      <section className="contact-info">
        {[
          { icon: <Phone size={32} />, title: "Phone", text: "+92 300 1234567" },
          { icon: <Mail size={32} />, title: "Email", text: "support@sehatly.pk" },
          { icon: <MapPin size={32} />, title: "Address", text: "Karachi, Pakistan" },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="info-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            {item.icon}
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </motion.div>
        ))}
      </section>

      {/* SUPPORT HOURS */}
      <section className="support-hours">
        <h3>Customer Support Hours</h3>
        <p>Monday – Friday: 9:00 AM – 10:00 PM</p>
        <p>Saturday – Sunday: 10:00 AM – 8:00 PM</p>

        {/* Agent Availability */}
        <div className="agent-status available">
          <span className="dot"></span> Agent Available
        </div>
      </section>

      {/* CONTACT FORM */}
      <motion.section
        className="contact-form-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Send Us a Message</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
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
          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" className="send-btn">
            <Send size={18} /> Send Message
          </button>
          {submitted && <p className="success-msg">✔ Message sent successfully!</p>}
        </form>
      </motion.section>

      {/* MAP */}
      <motion.section
        className={`contact-map ${mapRevealed ? "revealed" : ""}`}
        onViewportEnter={() => setMapRevealed(true)}
        viewport={{ once: true }}
      >
        <h2>Find Us Here</h2>
        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109466.8850496316!2d74.22968!3d31.52037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391904d6bae0d8c3%3A0x56c5ce57a4f0c1e!2sLahore!5e0!3m2!1sen!2s!4v1700000000000"
          loading="lazy"
          allowFullScreen
        ></iframe>
      </motion.section>

      {/* CHATBOT BUTTON */}
      <div className="chatbot-widget" onClick={() => setChatOpen(!chatOpen)}>
        <MessageCircle size={30} color="white" />
      </div>

      {/* CHAT WINDOW */}
    {chatOpen && (
    <motion.div
        className="chat-window"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
    >
        <div className="chat-header">Sehatly Support</div>
        <div className="chat-body">
        {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.type}`}>
            {msg.text}
            </div>
        ))}
        </div>
        <div className="chat-input-row">
        <input
            className="chat-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="chat-send-btn" onClick={handleSend}>Send</button>
        </div>
    </motion.div>
    )}

    </div>
  );
}
