// src/components/Auth.js
import React, { useState, useContext } from "react";
import axios from "axios";
import "./Auth.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup fields
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setShowPassword(false);

    // Clear all fields
    setLoginEmail(""); 
    setLoginPassword("");
    setSignupName(""); 
    setSignupEmail(""); 
    setSignupPassword("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Signup successful! You can now login.");
        setIsLogin(true);
        setSignupName(""); 
        setSignupEmail(""); 
        setSignupPassword("");
      } else {
        setMessage(data.message || "❌ Signup failed.");
      }
    } catch (err) {
      setMessage("❌ Something went wrong.");
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", loginEmail);
        login(loginEmail, res.data.token);
        setMessage("✅ Login successful!");
        setLoginEmail(""); 
        setLoginPassword("");
        navigate("/");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Login failed");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Hidden dummy form to prevent browser autofill */}
        <form style={{ display: "none" }}>
          <input type="email" name="dummy_email" autoComplete="username" />
          <input type="password" name="dummy_password" autoComplete="new-password" />
        </form>

        <div className="tabs">
          <button className={isLogin ? "active-tab" : ""} onClick={toggleForm}>Login</button>
          <button className={!isLogin ? "active-tab" : ""} onClick={toggleForm}>Signup</button>
        </div>

        {message && (
          <p className={message.includes("successful") ? "success-msg" : "error-msg"}>
            {message}
          </p>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form" autoComplete="off">
            <input
              type="email"
              name="login_email_unique"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              autoComplete="off"
            />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="login_password_unique"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button type="submit" className="auth-btn">Login</button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="auth-form" autoComplete="off">
            <input
              type="text"
              name="signup_name_unique"
              placeholder="Full Name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              required
              autoComplete="off"
            />
            <input
              type="email"
              name="signup_email_unique"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
              autoComplete="off"
            />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="signup_password_unique"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button type="submit" className="auth-btn">Signup</button>
          </form>
        )}

        <p className="toggle-link">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleForm}>{isLogin ? "Signup here" : "Login here"}</span>
        </p>

        <div className="auth-footer">
          Connect with Sehatly: 
          <a href="#">Facebook</a> | 
          <a href="#">Twitter</a> | 
          <a href="#">Instagram</a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
