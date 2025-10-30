import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";
import Medicine from "./models/medicine.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("MongoDB is connected successfully!");
});

// ✅ Fetch all medicines from your database
app.get("/medicines", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    console.log("Medicines in database:", medicines);
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Sync medicines from openFDA API (Auto-Update old ones)
app.get("/api/sync-medicines", async (req, res) => {
  try {
    const queries = [
      "purpose:pain",
      "purpose:antibiotic",
      "purpose:fever",
      "purpose:allergy",
      "purpose:antidepressant",
      "purpose:diabetes",
      "purpose:hypertension",
      "purpose:asthma",
      "purpose:antifungal",
      "purpose:vaccine"
    ];

    let added = 0;
    let updated = 0;

    for (const query of queries) {
      const response = await fetch(`https://api.fda.gov/drug/label.json?search=${query}&limit=100`);
      const data = await response.json();

      if (!data.results) continue;

      const medicines = data.results.map(item => ({
        name: item.openfda?.generic_name?.[0] || "Unknown",
        brand: item.openfda?.brand_name?.[0] || "Generic",
        description: item.description?.[0] || "No description available",
        category_id: null,
        price: Math.floor(Math.random() * 1000) + 100,
        stockQuantity: Math.floor(Math.random() * 50) + 10,
        req_prescription: Math.random() > 0.5
      }));

      for (const med of medicines) {
        const existing = await Medicine.findOne({ name: med.name });
        if (existing) {
          await Medicine.updateOne({ _id: existing._id }, { $set: med });
          updated++;
        } else {
          await Medicine.create(med);
          added++;
        }
      }
    }

    res.json({
      message: "✅ Medicines synced successfully!",
      added,
      updated
    });

  } catch (err) {
    console.error("❌ Error syncing medicines:", err);
    res.status(500).json({ message: err.message });
  }
});
app.get("/cart", verifyToken, async (req, res) => {
  // Only logged-in users can reach here
  const userId = req.user.userId;
  // Fetch cart info from DB for this user
  res.json({ message: `Cart data for user ${userId}` });
});

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
