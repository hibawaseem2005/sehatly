import express from "express";
import Medicine from "../models/medicine.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();
// Configure multer to store uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/medicines"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});
const upload = multer({ storage });

// 🧑‍⚕️ Vendor: Add new medicine
router.post("/add", verifyToken, upload.single("image"), async (req, res) => {
  try {
    console.log("ADD MED - req.body:", req.body);
    console.log("ADD MED - req.file:", req.file);

    const { name, brand, description, category_id, price, discount, stockQuantity, req_prescription } = req.body;

    const verifyWithFDA = async (medName) => {
      try {
        const fields = ["brand_name", "generic_name", "substance_name"];
        for (const field of fields) {
          const response = await fetch(
            `https://api.fda.gov/drug/label.json?search=${field}:${encodeURIComponent(medName)}&limit=1`
          );
          const data = await response.json();
          if (data.results && data.results.length > 0) return true;
        }
        return false;
      } catch (err) {
        console.log("FDA verification error:", err);
        return false;
      }
    };

    const isAuthentic = await verifyWithFDA(name);

    // ✅ Save full relative path for image
    const newMed = new Medicine({
      name,
      brand,
      description,
      category_id,
      price,
      discount: discount || 0,
      stockQuantity,
      req_prescription,
      vendorId: req.user.userId,
      image: req.file ? `images/medicines/${req.file.originalname}` : null, // keep original filename
      verified: isAuthentic,
      status: isAuthentic ? "approved" : "pending",
      addedAt: new Date(),
    });

    await newMed.save();

    res.status(201).json({
      message: isAuthentic
        ? "Medicine verified & added successfully!"
        : "Medicine added but pending admin approval",
      medicine: newMed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// 🧑‍⚕️ Vendor: View only their medicines
router.get("/vendor", verifyToken, async (req, res) => {
  try {
    const medicines = await Medicine.find({ vendorId: req.user.userId });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🧑‍⚕️ Admin: View all medicines
router.get("/admin", verifyToken, async (req, res) => {
  try {
    const medicines = await Medicine.find().populate("vendorId", "name email");
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🧑‍⚕️ Admin/Vendor: Update stock
router.put("/update-stock/:id", verifyToken, async (req, res) => {
  try {
    const { stockQuantity } = req.body;
    const updatedMed = await Medicine.findByIdAndUpdate(req.params.id, { stockQuantity }, { new: true });
    res.json(updatedMed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
