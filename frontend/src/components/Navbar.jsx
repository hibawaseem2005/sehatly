// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import UserMenu from "./UserMenu";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Material UI Icons
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InventoryIcon from "@mui/icons-material/Inventory";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ add this
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const hiddenPaths = ["/admin", "/vendor"];
  const isHidden = hiddenPaths.some((path) => location.pathname.startsWith(path));

  // Only hide if path is hidden OR user is logged in as admin/vendor
  const shouldHideNavbar = isHidden || (user && user.role && user.role !== "customer");

  if (shouldHideNavbar) return null;
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  const handleMouseEnter = (icon) => setHoveredIcon(icon);
  const handleMouseLeave = () => setHoveredIcon(null);


  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <h2 style={styles.logo} onClick={() => navigate("/")}>
        💊 Sehatly
      </h2>

      {/* Right side icons */}
      <div style={styles.right}>
        {/* Medicines */}
        <div
          style={{
            ...styles.iconWrapper,
            transform: hoveredIcon === "medicines" ? "scale(1.15)" : "scale(1)",
            backgroundColor:
              hoveredIcon === "medicines" ? "rgba(255,255,255,0.18)" : "transparent",
          }}
          onClick={() => navigate("/")}
          title="Medicines"
          onMouseEnter={() => handleMouseEnter("medicines")}
          onMouseLeave={handleMouseLeave}
        >
          <LocalPharmacyIcon sx={{ fontSize: 26 }} />
        </div>

        {/* Cart */}
        <div
          style={{
            ...styles.iconWrapper,
            transform: hoveredIcon === "cart" ? "scale(1.15)" : "scale(1)",
            backgroundColor:
              hoveredIcon === "cart" ? "rgba(255,255,255,0.18)" : "transparent",
          }}
          onClick={() => navigate("/cart")}
          title="Cart"
          onMouseEnter={() => handleMouseEnter("cart")}
          onMouseLeave={handleMouseLeave}
        >
          <ShoppingCartIcon sx={{ fontSize: 26 }} />
          {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
        </div>

        {/* Notifications */}
        <div
          style={{
            ...styles.iconWrapper,
            transform: hoveredIcon === "notifications" ? "scale(1.15)" : "scale(1)",
            backgroundColor:
              hoveredIcon === "notifications" ? "rgba(255,255,255,0.18)" : "transparent",
          }}
          onClick = {() => navigate("/notifications")}
          title="Notifications"
          onMouseEnter={() => handleMouseEnter("notifications")}
          onMouseLeave={handleMouseLeave}
        >
          <NotificationsIcon sx={{ fontSize: 26 }} />
        </div>

        {/* Orders */}
        <div
          style={{
            ...styles.iconWrapper,
            transform: hoveredIcon === "orders" ? "scale(1.15)" : "scale(1)",
            backgroundColor:
              hoveredIcon === "orders" ? "rgba(255,255,255,0.18)" : "transparent",
            cursor: "pointer",
          }}
          title="Orders"
          onClick={() => navigate("/my-orders")}
          onMouseEnter={() => handleMouseEnter("orders")}
          onMouseLeave={handleMouseLeave}
        >
          <InventoryIcon sx={{ fontSize: 26 }} />
        </div>

        {/* User */}
        {user ? (
          <UserMenu />
        ) : (
          <Link
            to="/login"
            style={{
              ...styles.loginLink,
              transform: hoveredIcon === "login" ? "scale(1.1)" : "scale(1)",
            }}
            onMouseEnter={() => handleMouseEnter("login")}
            onMouseLeave={handleMouseLeave}
          >
            Login / Signup
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

/* ----------------------------------
   CLEAN, MODERN STYLE SYSTEM
---------------------------------- */
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 40px",
    backgroundColor: "#0A8F8A",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
    position: "sticky",
    top: 15,
    zIndex: 2000,
    transition: "all 0.3s ease",
    fontFamily: "'Inter', sans-serif",
  },

  logo: {
    margin: 0,
    fontSize: "1.8rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    color: "#ffffff",
    fontWeight: "800",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
  },

  iconWrapper: {
    position: "relative",
    cursor: "pointer",
    transition: "0.25s ease",
    padding: "6px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },

  badge: {
    position: "absolute",
    top: "-6px",
    right: "-10px",
    backgroundColor: "#ff4d4f",
    color: "white",
    borderRadius: "50%",
    padding: "3px 7px",
    fontSize: "11px",
    fontWeight: "700",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },

  loginLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
    padding: "6px 16px",
    borderRadius: "8px",
    backgroundColor: "#066E69",
    transition: "0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
};
