// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import UserMenu from "./UserMenu";
import { FaShoppingCart, FaBell, FaBox, FaPills } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";




const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  const iconColors = {
    medicines: "#00d4b3",
    cart: "#00c851",
    notifications: "#33b5e5",
    orders: "#ffbb33",
  };

  const handleMouseEnter = (icon) => setHoveredIcon(icon);
  const handleMouseLeave = () => setHoveredIcon(null);

  return (
    <nav style={styles.navbar}>
      {/* Left: Logo */}
      <h2 style={styles.logo} onClick={() => navigate("/")}>
        💊 <span style={styles.logoText}>Sehatly</span>
      </h2>

      {/* Right: Icons & User */}
      <div style={styles.right}>
        {/** Medicines icon **/}
        <div
          style={{
            ...styles.iconWrapper,
            color: hoveredIcon === "medicines" ? "#00fff0" : iconColors.medicines,
            transform: hoveredIcon === "medicines" ? "translateY(-2px)" : "translateY(0)",
          }}
          onClick={() => navigate("/")}
          title="Medicines"
          onMouseEnter={() => handleMouseEnter("medicines")}
          onMouseLeave={handleMouseLeave}
        >
          <FaPills size={24} />
        </div>

        {/** Cart icon **/}
        <div
          style={{
            ...styles.iconWrapper,
            color: hoveredIcon === "cart" ? "#00ff90" : iconColors.cart,
            transform: hoveredIcon === "cart" ? "translateY(-2px)" : "translateY(0)",
          }}
          onClick={() => navigate("/cart")}
          title="Cart"
          onMouseEnter={() => handleMouseEnter("cart")}
          onMouseLeave={handleMouseLeave}
        >
          <FaShoppingCart size={24} />
          {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
        </div>

        {/** Notifications icon **/}
        <div
          style={{
            ...styles.iconWrapper,
            color: hoveredIcon === "notifications" ? "#66ccff" : iconColors.notifications,
            transform: hoveredIcon === "notifications" ? "translateY(-2px)" : "translateY(0)",
          }}
          title="Notifications"
          onMouseEnter={() => handleMouseEnter("notifications")}
          onMouseLeave={handleMouseLeave}
        >
          <FaBell size={24} />
        </div>

        {/** Orders icon **/}
        <div
          style={{
            ...styles.iconWrapper,
            color: hoveredIcon === "orders" ? "#ffc233" : iconColors.orders,
            transform: hoveredIcon === "orders" ? "translateY(-2px)" : "translateY(0)",
            cursor: "pointer",
          }}
          title="Orders"
          onClick={() => navigate("/my-orders")}
          onMouseEnter={() => handleMouseEnter("orders")}
          onMouseLeave={handleMouseLeave}
        >
          <FaBox size={24} />
        </div>



        {/** User menu or login/signup **/}
        {user ? (
          <UserMenu />
        ) : (
          <Link
            to="/login"
            style={{
              ...styles.loginLink,
              color: hoveredIcon === "login" ? "#ffd700" : "#ffffff",
              transform: hoveredIcon === "login" ? "translateY(-2px)" : "translateY(0)",
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

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 40px",
    background: "linear-gradient(135deg, #00bfa5, #00d4b3)",
    backdropFilter: "blur(12px)",
    borderRadius: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    position: "sticky",
    top: 15,
    zIndex: 2000,
    transition: "all 0.3s ease",
    fontFamily: "'Inter', sans-serif",
  },
  logo: {
    margin: 0,
    fontSize: "1.9rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    textShadow: "2px 2px 5px rgba(0,0,0,0.2)",
    color: "white",
  },
  logoText: {
    fontWeight: "800",
    letterSpacing: "1.2px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },
  iconWrapper: {
    position: "relative",
    cursor: "pointer",
    transition: "all 0.3s ease",
    padding: "8px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: "-6px",
    right: "-10px",
    background: "linear-gradient(135deg, #ff3b2f, #ff6f61)",
    color: "white",
    borderRadius: "50%",
    padding: "4px 8px",
    fontSize: "12px",
    fontWeight: "700",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    animation: "pop 0.3s ease",
  },
  loginLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: "700",
    padding: "6px 16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
};

// Keyframes for badge pop
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes pop {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
`, styleSheet.cssRules.length);

export default Navbar;
