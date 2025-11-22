import express from "express"; 
import mongoose from "mongoose"; 
import dotenv from "dotenv"; 
import cors from "cors"; 
import fetch from "node-fetch"; 
import Medicine from "./models/medicine.js"; 
import authRoutes from "./routes/authRoutes.js"; 
import paymentRoutes from "./routes/paymentRoutes.js"; 
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import path from "path";
import adminMetricsRoutes from "./routes/adminMetrics.js";
import { fileURLToPath } from "url";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import http from "http";
import { Server } from "socket.io";
import vendorRoutes from "./routes/vendorRoutes.js";
import cookieParser from "cookie-parser";
import reminderRoutes from "./routes/reminderRoutes.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS setup to allow credentials from frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("MongoDB is connected successfully!");
});

// ================== ROUTES ================== //

// Add medicine
app.post("/add", verifyToken, async (req, res) => {
  try {
    const { name, brand, category_id, price, stockQuantity, req_prescription } = req.body;
    const vendorId = req.user.userId;

    const medicine = new Medicine({
      name,
      brand,
      category_id,
      price,
      stockQuantity,
      req_prescription,
      vendorId,
      addedAt: new Date(),
    });

    await medicine.save();
    res.json({ success: true, message: "Medicine added successfully!", medicine });
  } catch (err) {
    console.error("Error adding medicine:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get medicines added by vendor
app.get("/my-medicines", verifyToken, async (req, res) => {
  try {
    const vendorId = req.user.userId;
    const medicines = await Medicine.find({ vendorId });
    res.json({ success: true, medicines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Fetch all medicines
app.get("/medicines", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    console.log("Medicines in database:", medicines);
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sync medicines from openFDA
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
      "purpose:vaccine",
    ];

    let added = 0;
    let updated = 0;

    for (const query of queries) {
      const response = await fetch(`https://api.fda.gov/drug/label.json?search=${query}&limit=100`);
      const data = await response.json();

      if (!data.results) continue;

      const medicines = data.results.map((item) => ({
        name: item.openfda?.generic_name?.[0] || "Unknown",
        brand: item.openfda?.brand_name?.[0] || "Generic",
        description: item.description?.[0] || "No description available",
        category_id: categoryMap[query],
        price: Math.floor(Math.random() * 1000) + 100,
        stockQuantity: Math.floor(Math.random() * 50) + 10,
        req_prescription: Math.random() > 0.5,
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
      updated,
    });
  } catch (err) {
    console.error("❌ Error syncing medicines:", err);
    res.status(500).json({ message: err.message });
  }
});

// Cart route
app.get("/cart", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  res.json({ message: `Cart data for user ${userId}` });
});

// Use your routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/admin", adminMetricsRoutes);
app.use("/api/vendor", vendorRoutes);
app.use(cookieParser());
app.use("/api/reminders", reminderRoutes);
// ================== SOCKET.IO ================== //
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend origin
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ Admin dashboard connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Admin dashboard disconnected:", socket.id);
  });
});

// Export io for dashboard to use
export { io };

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
