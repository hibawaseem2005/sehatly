// backend/routes/adminMetrics.js
import express from "express";
import Order from "../models/orders.js"; // your Order model
const router = express.Router();

// --- Total Revenue ---
router.get("/total-revenue", async (req, res) => {
  try {
    const totalRevenueAgg = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

    // Last 30 days
    const monthlyAgg = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } }
      },
      { $group: { _id: null, monthly: { $sum: "$totalPrice" }, refunds: { $sum: "$refundAmount" } } }
    ]);

    res.json({
      totalRevenue,
      monthly: monthlyAgg[0]?.monthly || 0,
      refunds: monthlyAgg[0]?.refunds || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Top Medicines ---
router.get("/top-medicines", async (req, res) => {
  try {
    const topMedicines = await Order.aggregate([
      { $unwind: "$items" }, // items array in order
      { $group: { _id: "$items.name", totalSold: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);
    res.json(topMedicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Profit & Cost ---
router.get("/profit-margin", async (req, res) => {
  try {
    const orders = await Order.find();
    const profit = orders.reduce((acc, o) => acc + (o.totalPrice - o.cost), 0);
    const cost = orders.reduce((acc, o) => acc + o.cost, 0);
    const margin = cost ? (profit / cost) * 100 : 0;
    res.json({ profit, cost, margin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Average Order Value ---
router.get("/aov", async (req, res) => {
  try {
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
    res.json({ avgOrderValue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Conversion Rate (example: orders / visits) ---
router.get("/conversion-rate", async (req, res) => {
  try {
    // You need to store site visits or app visits somewhere
    const totalVisits = 1000; // example placeholder
    const totalOrders = await Order.countDocuments();
    const conversionRate = totalVisits ? (totalOrders / totalVisits) * 100 : 0;
    res.json({ conversionRate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Customer Lifetime Value (CLV) ---
router.get("/clv", async (req, res) => {
  try {
    // Example: average revenue per customer
    const orders = await Order.find();
    const customerMap = {};
    orders.forEach((o) => {
      customerMap[o.userId] = (customerMap[o.userId] || 0) + o.totalPrice;
    });
    const clv = Object.values(customerMap).length
      ? Object.values(customerMap).reduce((a, b) => a + b, 0) / Object.values(customerMap).length
      : 0;
    res.json(clv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Growth Rate (example: compare this month vs last month) ---
router.get("/growth-rate", async (req, res) => {
  try {
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastMonthRevenueAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const thisMonthRevenueAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: thisMonthStart } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const lastMonthRevenue = lastMonthRevenueAgg[0]?.total || 0;
    const thisMonthRevenue = thisMonthRevenueAgg[0]?.total || 0;

    const growthRate = lastMonthRevenue ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    res.json({ growthRate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
