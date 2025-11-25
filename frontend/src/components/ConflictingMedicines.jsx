// frontend/src/components/ConflictingMedicines.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../designs/ConflictingMedicines.css";

export default function ConflictingMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [selectedA, setSelectedA] = useState("");
  const [selectedB, setSelectedB] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const adminToken = localStorage.getItem("adminToken");

  const fetchData = async () => {
    try {
      setLoading(true);

      const medRes = await axios.get(
        "http://localhost:5000/api/medicines/admin",
        { headers: { Authorization: `Bearer ${adminToken}` }, withCredentials: true }
      );

      const conflictRes = await axios.get(
        "http://localhost:5000/api/incompatible/all",
        { headers: { Authorization: `Bearer ${adminToken}` }, withCredentials: true }
      );

      setMedicines(medRes.data);
      setConflicts(conflictRes.data.pairs || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load medicines or conflicts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddConflict = async () => {
    if (!selectedA || !selectedB) return setError("Select both medicines");
    if (selectedA === selectedB) return setError("Cannot select the same medicine");

    try {
      setAdding(true);
      await axios.post(
        "http://localhost:5000/api/incompatible/add",
        { drugA: selectedA, drugB: selectedB },
        { headers: { Authorization: `Bearer ${adminToken}` }, withCredentials: true }
      );

      setSelectedA("");
      setSelectedB("");
      setError("");
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to add conflict");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="conflict-container">
      <h2 className="conflict-title">Conflicting Medicines</h2>

      {loading ? (
        <p className="conflict-loading">Loading medicines and conflicts...</p>
      ) : (
        <>
          <div className="conflict-dropdowns">
            <div className="conflict-dropdown">
              <label>Medicine A</label>
              <select value={selectedA} onChange={(e) => setSelectedA(e.target.value)}>
                <option value="">Select medicine</option>
                {medicines.map((m) => (
                  <option key={m._id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="conflict-dropdown">
              <label>Medicine B</label>
              <select value={selectedB} onChange={(e) => setSelectedB(e.target.value)}>
                <option value="">Select medicine</option>
                {medicines.map((m) => (
                  <option key={m._id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            <button onClick={handleAddConflict} disabled={adding} className="add-conflict-btn">
              {adding ? "Adding..." : "Add Conflict"}
            </button>
          </div>

          {error && <p className="conflict-error">{error}</p>}

          <div className="conflict-list">
            {conflicts.length ? (
              conflicts.map((c) => (
                <div key={`${c.drugA}-${c.drugB}`} className="conflict-card">
                  <p>{c.drugA} ↔ {c.drugB}</p>
                </div>
              ))
            ) : (
              <p className="conflict-empty">No conflicting medicines yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
