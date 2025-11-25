import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const UserMenu = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Account deleted successfully.");
        logout();
      } else {
        alert("❌ " + (data.message || "Failed to delete account"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong.");
    }
  };

  return (
    <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      {/* User Icon */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#f0f8ff",
          color: "#007bff",
          border: "none",
          borderRadius: "50%",
          width: "45px",
          height: "45px",
          fontSize: "24px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <FaUserCircle size={28} />
      </button>

      {/* Dropdown Menu */}
      {open && user && (
        <div
          style={{
            position: "absolute",
            top: "55px",
            right: 0,
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            zIndex: 1000,
            minWidth: "200px",
            overflow: "hidden",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "15px",
              borderBottom: "1px solid #eee",
              fontSize: "0.95rem",
              color: "#555",
              backgroundColor: "#f7faff",
            }}
          >
            Logged in as
            <br />
            <span style={{ fontWeight: "600", color: "#007bff" }}>{user.email}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 15px",
              border: "none",
              background: "transparent",
              textAlign: "left",
              cursor: "pointer",
              transition: "background 0.2s",
              color: "#007bff",
              fontWeight: "500",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f8ff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Log out
          </button>

          {/* Delete Account */}
          <button
            onClick={handleDelete}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 15px",
              border: "none",
              background: "transparent",
              textAlign: "left",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
              color: "#ff4d4f",
              fontWeight: "500",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fff1f0";
              e.currentTarget.style.color = "#d4380d";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#ff4d4f";
            }}
          >
            Delete account
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
