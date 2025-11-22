import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../designs/Notifications.css";

// MUI icons
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import SnoozeIcon from "@mui/icons-material/Snooze";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MedicationIcon from "@mui/icons-material/Medication";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

const Notifications = () => {
  const [medicine, setMedicine] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [timeUnit, setTimeUnit] = useState("hours");
  const [reminders, setReminders] = useState([]);
  const soundRef = useRef(null);

  useEffect(() => {
    soundRef.current = new Audio("/notification-sound.mp3");
  }, []);

  useEffect(() => {
    if (Notification.permission !== "granted") Notification.requestPermission();
  }, []);

  // fetch reminders
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/reminders/my-reminders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReminders(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReminders();
  }, []);

  const calculateNext = (value, unit) => {
    const ms = unit === "hours" ? value * 60 * 60 * 1000 : value * 60 * 1000;
    return new Date(Date.now() + ms);
  };

  const handleAddReminder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login");

    if (!medicine) return alert("Enter a medicine name");
    if (!timeValue || timeValue <= 0) return alert("Enter valid time");

    try {
      const nextTrigger = calculateNext(Number(timeValue), timeUnit);
      const res = await axios.post(
        `${API_BASE}/reminders/add`,
        { medicine, timeValue: Number(timeValue), timeUnit, nextTrigger },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReminders((prev) => [...prev, res.data]);
      setMedicine("");
      setTimeValue("");
    } catch (err) {
      console.error(err);
      alert("Failed to save reminder. Please login.");
    }
  };

  const snoozeReminder = async (id, minutes) => {
    try {
      const token = localStorage.getItem("token");
      const nextTrigger = new Date(Date.now() + minutes * 60 * 1000);
      const res = await axios.put(
        `${API_BASE}/reminders/${id}`,
        { nextTrigger },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReminders((prev) => prev.map((r) => (r._id === id ? res.data : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const dismissReminder = async (id) => {
    if (!window.confirm("Remove this reminder?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const triggerLocal = (med) => {
    if (Notification.permission === "granted") {
      new Notification("💊 Medicine Reminder", { body: `Time to take ${med}!` });
    }
    if (soundRef.current) soundRef.current.play().catch(() => {});
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach(async (r) => {
        if (now >= new Date(r.nextTrigger)) {
          triggerLocal(r.medicine);
          const newNext = calculateNext(r.timeValue, r.timeUnit);

          const token = localStorage.getItem("token");
          try {
            const res = await axios.put(
              `${API_BASE}/reminders/${r._id}`,
              { nextTrigger: newNext },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setReminders((prev) => prev.map((x) => (x._id === r._id ? res.data : x)));
          } catch (err) {
            console.error(err);
          }
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <div className="reminder-container">
      <div className="reminder-card animate-card">
        <h2 className="title">
          <MedicationIcon style={{ color: "#008080", marginRight: 8 }} />
          Medicine Reminder
        </h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Medicine name"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
          />
          <input
            type="number"
            placeholder="Time"
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
          />
          <select value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)}>
            <option value="hours">Hours</option>
            <option value="minutes">Minutes</option>
          </select>
          <button onClick={handleAddReminder}>
            <AddAlertIcon style={{ fontSize: 18, marginRight: 6 }} /> Set
          </button>
        </div>

        <h3 className="subtitle">
          <NotificationsActiveIcon style={{ color: "#00bfa6", marginRight: 8 }} />
          Active Reminders
        </h3>

        <ul className="reminder-list">
          {reminders.length === 0 && <p className="empty">No reminders yet.</p>}

          {reminders.map((r) => (
            <li key={r._id} className="reminder-item">
              <div>
                Take <strong>{r.medicine}</strong> every {r.timeValue} {r.timeUnit}.
                <br />
                Next at: {new Date(r.nextTrigger).toLocaleTimeString()}
              </div>

              <div className="reminder-actions">
                <button className="snooze-btn" onClick={() => snoozeReminder(r._id, 5)}>
                  <SnoozeIcon style={{ fontSize: 16 }} /> 5m
                </button>

                <button className="snooze-btn" onClick={() => snoozeReminder(r._id, 10)}>
                  <SnoozeIcon style={{ fontSize: 16 }} /> 10m
                </button>

                <button className="dismiss-btn" onClick={() => dismissReminder(r._id)}>
                  <DeleteForeverIcon style={{ fontSize: 18, marginRight: 6 }} />
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
