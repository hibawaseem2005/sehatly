import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import CountUp from "react-countup";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";


// Framer Motion
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { Settings, TrendingUp, Package, Users, Eye, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Helper for conditional classes
const cx = (...args) => args.filter(Boolean).join(" ");

export default function AdminDashboardLavish() {
  const [tab, setTab] = useState(0);
  const [metrics, setMetrics] = useState({
    "total-revenue": { totalRevenue: 0, monthly: 0, refunds: 0 },
    "profit-margin": { profit: 0, cost: 0, margin: 0 },
    aov: { avgOrderValue: 0 },
    "conversion-rate": { conversionRate: 0 },
    clv: 0,
    "top-medicines": [],
    "growth-rate": { growthRate: 0 },
  });

  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [heroPulse, setHeroPulse] = useState(false);
  const [modalChart, setModalChart] = useState(null); // { title, data, options }

  useEffect(() => void setHeroPulse(true), []);

  const toggleExpand = (key) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const urls = [
        "total-revenue",
        "profit-margin",
        "aov",
        "conversion-rate",
        "clv",
        "top-medicines",
        "cac",
        "roi",
        "break-even",
        "growth-rate",
      ];

      const promises = urls.map((u) =>
        axios
          .get(`/api/admin/${u}`, { withCredentials: true })
          .then((r) => ({ key: u, data: r.data }))
          .catch(() => ({ key: u, error: true }))
      );

      const resolved = await Promise.all(promises);
      const results = {};
      resolved.forEach((r) => {
        if (!r.error) results[r.key] = r.data;
      });

      setMetrics(results);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  // ---- Charts ----
  const revenueChart = useMemo(
    () => ({
      labels: ["Revenue", "Profit", "Cost"],
      datasets: [
        {
          label: "Amount (USD)",
          data: [
            metrics["total-revenue"]?.totalRevenue || 0,
            metrics["profit-margin"]?.profit || 0,
            metrics["profit-margin"]?.cost || 0,
          ],
          backgroundColor: ["rgba(79, 209, 197, 0.9)", "rgba(79, 153, 255, 0.9)", "rgba(255, 111, 97, 0.9)"],
          borderRadius: 8,
        },
      ],
    }),
    [metrics]
  );

  const topMedicinesChart = useMemo(
    () => ({
      labels: metrics["top-medicines"]?.map((m) => m._id) || [],
      datasets: [
        {
          label: "Units Sold",
          data: metrics["top-medicines"]?.map((m) => m.totalSold) || [],
          backgroundColor: "rgba(255, 181, 64, 0.95)",
          borderRadius: 8,
        },
      ],
    }),
    [metrics]
  );

  const sparklineData = useMemo(
    () => ({
      labels: Array.from({ length: 12 }, (_, i) => `D${i + 1}`),
      datasets: [
        {
          data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 200 + 20)),
          fill: true,
          tension: 0.4,
        },
      ],
    }),
    []
  );

  // Modal helpers
  const openChartModal = (title, chartObj, ChartComponent = Bar) =>
    setModalChart({ title, chartObj, ChartComponent });
  const closeChartModal = () => setModalChart(null);

  // Skeleton
  const Skeleton = () => (
    <div className="animate-pulse bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl h-28 w-full" />
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-slate-50 via-white to-slate-100 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Header / Hero */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <div
              className={cx(
                "p-3 rounded-2xl shadow-2xl",
                heroPulse ? "bg-gradient-to-br from-emerald-400 to-cyan-400" : "bg-emerald-400"
              )}
            >
              <Sparkles className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Sehatly Admin • Analytics</h1>
              <p className="text-sm text-slate-500 mt-1">
                A lavish, highly-interactive dashboard with animated insights.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow hover:shadow-lg transition">
              <Settings size={16} /> Settings
            </button>
            <div className="bg-white px-4 py-2 rounded-2xl shadow text-sm">Auto-refresh: 30s</div>
          </div>
        </motion.header>

        {/* Tabs */}
        <nav className="bg-white rounded-2xl shadow p-1 mb-6 flex gap-1 overflow-hidden">
          {[
            { label: "Overview", icon: TrendingUp },
            { label: "Orders", icon: Package },
            { label: "Customers", icon: Users },
            { label: "Growth", icon: TrendingUp },
            { label: "Top Items", icon: Eye },
          ].map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTab(i)}
              className={cx(
                "flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                tab === i
                  ? "bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </nav>

        {/* Content area */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left column */}
          <div className="col-span-12 lg:col-span-8">
            {/* Overview cards */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Total Revenue */}
              <motion.div whileHover={{ y: -6 }} className="col-span-2 sm:col-span-1 bg-gradient-to-br from-white to-slate-50 p-5 rounded-2xl shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Revenue</p>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-2xl font-extrabold text-slate-900">
                        $
                        <CountUp
                          end={metrics["total-revenue"]?.totalRevenue || 0}
                          duration={1.4}
                          separator=","
                        />
                      </h2>
                      <span className="text-xs px-2 py-1 rounded-2xl bg-green-50 text-green-600">
                        +{(metrics["growth-rate"]?.growthRate?.toFixed(1) || 0)}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Last 30 days • real-time</p>
                  </div>
                  <div>
                    <button
                      onClick={() => openChartModal("Revenue Breakdown", revenueChart, Bar)}
                      className="p-2 rounded-lg bg-white shadow hover:scale-105 transition"
                    >
                      View
                    </button>
                  </div>
                </div>

                <div className="mt-4">{loading ? <Skeleton /> : <div className="text-xs text-slate-500">Revenue is surging thanks to higher AOV and conversion improvements.</div>}</div>
              </motion.div>

              {/* Average Order Value */}
              <motion.div whileHover={{ y: -6 }} className="col-span-2 sm:col-span-1 bg-gradient-to-br from-white to-slate-50 p-5 rounded-2xl shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Average Order Value</p>
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      $
                      <CountUp
                        end={metrics["aov"]?.avgOrderValue ? Number(metrics["aov"]?.avgOrderValue).toFixed(2) : 0}
                        duration={1.4}
                        separator=","
                      />
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">AOV improves with bundling & cross-sell</p>
                  </div>
                  <div>
                    <button
                      onClick={() => openChartModal("AOV Trend", sparklineData, Line)}
                      className="p-2 rounded-lg bg-white shadow hover:scale-105 transition"
                    >
                      Trend
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Profit & Cost Breakdown */}
            <motion.div className="bg-white rounded-2xl p-5 shadow-lg" whileHover={{ scale: 1.01 }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Profit & Cost Breakdown</h3>
                  <p className="text-sm text-slate-500">Interactive stacked view — click to expand</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleExpand("profitDetails")} className="flex items-center gap-2 text-sm bg-slate-50 px-3 py-2 rounded-2xl">
                    Details {expanded["profitDetails"] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <div className="h-56">
                    <Bar data={revenueChart} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
                  </div>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-3">
                  <div className="p-3 bg-gradient-to-br from-emerald-50 to-white rounded-xl">
                    <p className="text-xs text-slate-500">Profit</p>
                    <p className="text-xl font-bold text-emerald-700">${metrics["profit-margin"]?.profit || 0}</p>
                    <p className="text-xs text-slate-400">Margin: {(metrics["profit-margin"]?.margin?.toFixed(2) || 0)}%</p>
                  </div>

                  <div className="p-3 bg-gradient-to-br from-red-50 to-white rounded-xl">
                    <p className="text-xs text-slate-500">Cost</p>
                    <p className="text-xl font-bold text-rose-600">${metrics["profit-margin"]?.cost || 0}</p>
                    <p className="text-xs text-slate-400">Top cost drivers shown</p>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expanded["profitDetails"] && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-4 bg-slate-50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">Monthly Recurring Revenue</p>
                        <p className="font-semibold">${metrics["total-revenue"]?.monthly || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Refunds</p>
                        <p className="font-semibold">${metrics["total-revenue"]?.refunds || "—"}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Top medicines */}
            <motion.section className="mt-4 bg-white rounded-2xl p-5 shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Top Medicines</h3>
                <div className="text-sm text-slate-500">Units sold • last 30 days</div>
              </div>

              <div className="grid gap-3">
                {loading ? (
                  <Skeleton />
                ) : metrics["top-medicines"]?.length ? (
                  metrics["top-medicines"].map((m, idx) => (
                    <motion.div key={m._id} whileHover={{ x: 6 }} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-white to-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-semibold">{idx + 1}</div>
                        <div>
                          <div className="font-semibold text-slate-900">{m._id}</div>
                          <div className="text-xs text-slate-500">{m.category || "Medicine"}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{m.totalSold} units</div>
                        <div className="text-xs text-slate-400">Revenue: ${m.revenue || 0}</div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">No top medicines yet</div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Right column */}
          <aside className="col-span-12 lg:col-span-4 sticky top-6">
            {/* Conversion */}
            <motion.div className="bg-white rounded-2xl p-5 shadow-lg mb-4" initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Conversion</p>
                  <h4 className="text-2xl font-bold text-rose-600">
                    {metrics["conversion-rate"]?.conversionRate ? Number(metrics["conversion-rate"]?.conversionRate).toFixed(2) : 0}%
                  </h4>
                </div>
                <div className="text-xs text-slate-400">vs last month</div>
              </div>

              <div className="mt-4">
                <div className="h-24">
                  <Line data={sparklineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
              </div>
            </motion.div>

            {/* CLV */}
            <motion.div className="bg-white rounded-2xl p-5 shadow-lg mb-4" whileHover={{ scale: 1.01 }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Customer Lifetime Value</p>
                  <h4 className="text-xl font-bold text-emerald-700">${metrics["clv"] ? Number(metrics["clv"]).toFixed(2) : 0}</h4>
                </div>
                <div className="text-xs text-slate-400">Avg customer</div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-3 py-2 rounded-lg bg-cyan-600 text-white">Campaigns</button>
                <button className="flex-1 px-3 py-2 rounded-lg bg-slate-50">Segments</button>
              </div>
            </motion.div>

            {/* Growth */}
            <motion.div className="bg-gradient-to-br from-indigo-600 to-cyan-500 text-white rounded-2xl p-5 shadow-lg mb-4">
              <p className="text-sm">Growth Rate</p>
              <h3 className="text-2xl font-bold">{metrics["growth-rate"]?.growthRate?.toFixed(1) || 0}%</h3>
              <div className="h-20 mt-2">
                <Line data={sparklineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalChart && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChartModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{modalChart.title}</h3>
                <button onClick={closeChartModal} className="text-slate-500 hover:text-slate-700 font-bold">
                  ×
                </button>
              </div>
              <modalChart.ChartComponent data={modalChart.chartObj} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
