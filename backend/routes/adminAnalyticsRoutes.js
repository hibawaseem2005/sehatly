import express from "express";
import Order from "../models/orders.js";
import OrderDetail from "../models/orderdetails.js";
import User from "../models/user.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only middleware
router.use(verifyToken, (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
});

// 1️⃣ Total Revenue
router.get("/total-revenue", async (req, res) => {
  const orders = await Order.find();
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  res.json({ totalRevenue });
});

// 2️⃣ Profit & Profit Margin
router.get("/profit-margin", async (req, res) => {
  const orderDetails = await OrderDetail.find();
  const revenue = orderDetails.reduce((sum, o) => sum + o.unitPrice * o.quantity, 0);
  const cost = revenue * 0.7; // Example: assume 70% cost
  const profit = revenue - cost;
  const profitMargin = revenue ? (profit / revenue) * 100 : 0;
  res.json({ profitMargin, profit, cost, revenue });
});

// 3️⃣ Average Order Value (AOV)
router.get("/aov", async (req, res) => {
  const orders = await Order.find();
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
  res.json({ avgOrderValue });
});

// 4️⃣ Conversion Rate
router.get("/conversion-rate", async (req, res) => {
  const totalVisitors = 1000; // Replace with real visitor tracking
  const ordersCount = await Order.countDocuments();
  const conversionRate = totalVisitors ? (ordersCount / totalVisitors) * 100 : 0;
  res.json({ conversionRate });
});

// 5️⃣ Customer Lifetime Value (CLV)
router.get("/clv", async (req, res) => {
  const users = await User.find();
  const orders = await Order.find();
  const revenuePerCustomer = users.map(u => {
    const userOrders = orders.filter(o => o.userId.toString() === u._id.toString());
    return userOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  });
  const clv = revenuePerCustomer.length ? revenuePerCustomer.reduce((a,b)=>a+b,0)/users.length : 0;
  res.json({ clv });
});

// 6️⃣ Top Medicines
router.get("/top-medicines", async (req, res) => {
  const top = await OrderDetail.aggregate([
    { $group: { _id: "$medicineId", totalSold: { $sum: "$quantity" } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);
  res.json(top);
});

// 7️⃣ Customer Acquisition Cost (CAC) - placeholder
router.get("/cac", async (req, res) => {
  const totalMarketingCost = 5000; // Example: put real spend here
  const newCustomers = await User.countDocuments(); // you could filter by signup date
  const cac = newCustomers ? totalMarketingCost / newCustomers : 0;
  res.json({ cac });
});

// 8️⃣ Return on Investment (ROI) - placeholder
router.get("/roi", async (req, res) => {
  const totalInvestment = 5000; // example: marketing + fixed costs
  const orders = await Order.find();
  const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const profit = revenue - totalInvestment;
  const roi = totalInvestment ? (profit / totalInvestment) * 100 : 0;
  res.json({ roi, profit, revenue, totalInvestment });
});

// 9️⃣ Break-Even Analysis - placeholder
router.get("/break-even", async (req, res) => {
  const fixedCosts = 10000; // example fixed costs
  const unitCost = 70; // example avg cost per medicine
  const avgSellingPrice = 100; // example
  const breakEvenUnits = unitCost < avgSellingPrice ? Math.ceil(fixedCosts / (avgSellingPrice - unitCost)) : 0;
  res.json({ breakEvenUnits, fixedCosts, unitCost, avgSellingPrice });
});

// 🔟 Growth Rate of E-Commerce Sales
router.get("/growth-rate", async (req, res) => {
  // Example: compare last 30 days vs previous 30 days
  const now = new Date();
  const last30 = new Date(now.getTime() - 30*24*60*60*1000);
  const prev30 = new Date(now.getTime() - 60*24*60*60*1000);

  const revenueLast30 = (await Order.find({ date: { $gte: last30 } }))
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const revenuePrev30 = (await Order.find({ date: { $gte: prev30, $lt: last30 } }))
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const growthRate = revenuePrev30 ? ((revenueLast30 - revenuePrev30) / revenuePrev30) * 100 : 0;
  res.json({ growthRate, revenueLast30, revenuePrev30 });
});

export default router;
