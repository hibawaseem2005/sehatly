import express from "express"; //handles http requests
import mongoose from "mongoose"; //connection w mongo
import dotenv from "dotenv"; //env file se vars ko load krta
import cors from "cors"; //allows my server to handle requests from diff origins like frontend is using 3000 and db is using 5000
import fetch from "node-fetch"; //reqs for external http APIs jaise k fda wagaira
import Medicine from "./models/medicine.js"; //imports medicine model
import authRoutes from "./routes/authRoutes.js"; // handles login/signup routes
import paymentRoutes from "./routes/paymentRoutes.js"; //payment rel shi
import orderRoutes from "./routes/orderRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import path from "path";
import adminMetricsRoutes from "./routes/adminMetrics.js";
import { fileURLToPath } from "url";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import http from "http";
import { Server } from "socket.io";



const router = express.Router();
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { name, brand, category_id, price, stockQuantity, req_prescription } = req.body;
    const vendorId = req.user.userId; // taken from JWT

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
// ✅ Get all medicines added by vendor
router.get("/my-medicines", verifyToken, async (req, res) => {
  try {
    const vendorId = req.user.userId;
    const medicines = await Medicine.find({ vendorId });
    res.json({ success: true, medicines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
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
        category_id: categoryMap[query],
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
app.use("/api/orders", orderRoutes);
app.use("api/vendors", vendorRoutes);
app.use("api/admin", adminRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/admin", adminMetricsRoutes);
const PORT = process.env.PORT || 5000;
const server = http.createServer(app); // create HTTP server
const io = new Server(server, {
  cors: { origin: "*" } // allow frontend origin
});
io.on("connection", (socket) => {
  console.log("✅ Admin dashboard connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Admin dashboard disconnected:", socket.id);
  });
});

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default router;
export { io };