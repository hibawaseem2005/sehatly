import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa"; // <-- added React Icon

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
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "white",
          color: "#007bff",
          border: "none",
          borderRadius: "50%",
          width: "35px",
          height: "35px",
          fontSize: "20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        <FaUserCircle size={22} /> {/* <-- replaced emoji with React Icon */}
      </button>

      {open && user && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: 1000,
            minWidth: "160px",
          }}
        >
          <p
            style={{
              margin: 0,
              padding: "10px",
              borderBottom: "1px solid #eee",
              fontSize: "0.9rem",
            }}
          >
            Logged in as: {user.email}
          </p>
          <button
            onClick={logout}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Log out
          </button>
          <button
            onClick={handleDelete}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              border: "none",
              background: "transparent",
              color: "red",
              cursor: "pointer",
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
