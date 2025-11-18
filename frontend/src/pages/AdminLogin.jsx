import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

const SehatlyAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.data.role !== "admin") {
        return setError("You are NOT an admin!");
      }

      localStorage.setItem("token", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Sehatly Admin Login</h2>
        <p className={styles.subtitle}>Sign in and start managing your Analytics</p>

        {error && <div className={styles.alert}>{error}</div>}

        <form onSubmit={handleAdminLogin} className={styles.form}>
          <input
            className={styles.inputField}
            type="email"
            placeholder="Login"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className={styles.optionsRow}>
            <label className={styles.rememberMe}>
              <input type="checkbox" /> Remember me
            </label>
            <a className={styles.forgotPassword}>Forgot password?</a>
          </div>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SehatlyAdminLogin;
