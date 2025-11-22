import express from "express";
import Order from "../models/orders.js";
import OrderDetail from "../models/orderdetails.js";
import User from "../models/user.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only
router.use(verifyToken, (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
});

// Helper
const toNumber = (val) => (val != null && !isNaN(val) ? Number(val) : 0);

// Total Revenue
router.get("/total-revenue", async (req, res) => {
  try {
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, o) => sum + toNumber(o.totalPrice), 0);
    res.json({ totalRevenue, monthly: totalRevenue, refunds: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ totalRevenue: 0, monthly: 0, refunds: 0 });
  }
});

// Revenue History (sparkline)
router.get("/revenue-history", async (req, res) => {
  try {
    const now = new Date();
    const days = 12;
    const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const orders = await Order.find({ createdAt: { $gte: start } });

    const dailyRevenue = Array.from({ length: days }, (_, i) => {
      const day = new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000);
      const dayStart = new Date(day.setHours(0, 0, 0, 0));
      const dayEnd = new Date(day.setHours(23, 59, 59, 999));
      return orders
        .filter((o) => o.createdAt && o.createdAt >= dayStart && o.createdAt <= dayEnd)
        .reduce((sum, o) => sum + toNumber(o.totalPrice), 0);
    });

    res.json(dailyRevenue);
  } catch {
    res.json(Array(12).fill(0));
  }
});

// Profit & Margin
router.get("/profit-margin", async (req, res) => {
  try {
    const orderDetails = await OrderDetail.find();
    const revenue = orderDetails.reduce((sum, o) => sum + toNumber(o.unitPrice) * toNumber(o.quantity), 0);
    const cost = revenue * 0.7; // assume 70% cost
    const profit = revenue - cost;
    const margin = revenue ? (profit / revenue) * 100 : 0;
    res.json({ profit, cost, margin });
  } catch {
    res.status(500).json({ profit: 0, cost: 0, margin: 0 });
  }
});

// AOV
router.get("/aov", async (req, res) => {
  try {
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, o) => sum + toNumber(o.totalPrice), 0);
    const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
    res.json({ avgOrderValue });
  } catch {
    res.status(500).json({ avgOrderValue: 0 });
  }
});

// Conversion Rate (placeholder)
router.get("/conversion-rate", async (req, res) => {
  try {
    const totalVisitors = 1000; // replace with real data
    const ordersCount = await Order.countDocuments();
    const conversionRate = totalVisitors ? (ordersCount / totalVisitors) * 100 : 0;
    res.json({ conversionRate });
  } catch {
    res.json({ conversionRate: 0 });
  }
});

// CLV
router.get("/clv", async (req, res) => {
  try {
    const users = await User.find();
    const orders = await Order.find();
    const revenuePerCustomer = users.map(u => {
      const userOrders = orders.filter(o => o.userId?.toString() === u._id.toString());
      return userOrders.reduce((sum, o) => sum + toNumber(o.totalPrice), 0);
    });
    const clv = revenuePerCustomer.length ? revenuePerCustomer.reduce((a,b)=>a+b,0)/users.length : 0;
    res.json({ clv });
  } catch {
    res.json({ clv: 0 });
  }
});

// Top Medicines
router.get("/top-medicines", async (req, res) => {
  try {
    const top = await OrderDetail.aggregate([
      { $group: { _id: "$medicineId", totalSold: { $sum: "$quantity" }, revenue: { $sum: { $multiply: ["$unitPrice", "$quantity"] } }, category: { $first: "$category" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);
    res.json(top);
  } catch {
    res.status(500).json([]);
  }
});

// Growth Rate
router.get("/growth-rate", async (req, res) => {
  try {
    const now = new Date();
    const last30 = new Date(now.getTime() - 30*24*60*60*1000);
    const prev30 = new Date(now.getTime() - 60*24*60*60*1000);

    const revenueLast30 = (await Order.find({ createdAt: { $gte: last30 } }))
      .reduce((sum, o) => sum + toNumber(o.totalPrice), 0);

    const revenuePrev30 = (await Order.find({ createdAt: { $gte: prev30, $lt: last30 } }))
      .reduce((sum, o) => sum + toNumber(o.totalPrice), 0);

    const growthRate = revenuePrev30 ? ((revenueLast30 - revenuePrev30)/revenuePrev30)*100 : 0;
    res.json({ growthRate, revenueLast30, revenuePrev30 });
  } catch {
    res.json({ growthRate: 0, revenueLast30: 0, revenuePrev30: 0 });
  }
});

export default router;
