import express from "express";
import VendorRequest from "../models/VendorRequest.js";
import Vendor from "../models/vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Vendor submits request
router.post("/request", async (req, res) => {
  try {
    const { name, email, phone, businessName, serviceType, city, website, message } = req.body;

    const existing = await VendorRequest.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Request already submitted" });

    const newRequest = new VendorRequest({ name, email, phone, businessName, serviceType, city, website, message });
    await newRequest.save();

    res.json({ success: true, message: "Vendor request submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all pending requests (admin)
router.get("/requests", verifyAdmin, async (req, res) => {
  try {
    const requests = await VendorRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Approve request (admin)
router.post("/approve/:id", verifyAdmin, async (req, res) => {
  try {
    const request = await VendorRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = new Vendor({ name: request.name, email: request.email, password: hashedPassword });
    await vendor.save();

    // send email (optional)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: request.email,
      subject: "Your Vendor Account Approved",
      text: `Hello ${request.name},\n\nYour account is approved.\nEmail: ${request.email}\nPassword: ${password}`
    });

    await request.deleteOne();
    res.json({ success: true, message: "Vendor approved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reject request (admin)
router.post("/reject/:id", verifyAdmin, async (req, res) => {
  try {
    const request = await VendorRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    await request.deleteOne();
    res.json({ success: true, message: "Request rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all approved vendors (admin)
router.get("/vendors", verifyAdmin, async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json({ success: true, vendors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt email:", email);
    console.log("Login attempt password:", password);

    const vendor = await Vendor.findOne({ email });
    console.log("Vendor found in DB:", vendor);

    if (!vendor) return res.status(400).json({ success: false, message: "Invalid credentials!" });

    const isMatch = await bcrypt.compare(password, vendor.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials!" });

    const token = jwt.sign({ userId: vendor._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});



export default router;
