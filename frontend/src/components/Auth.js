// src/components/Auth.js
import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

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
      localStorage.setItem("token", res.data.token);
      setMessage("✅ Login successful!");
      setLoginEmail("");
      setLoginPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Login failed");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="tabs">
          <button
            className={isLogin ? "active-tab" : ""}
            onClick={toggleForm}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active-tab" : ""}
            onClick={toggleForm}
          >
            Signup
          </button>
        </div>

        {message && (
          <p
            className={message.includes("successful") ? "success-msg" : "error-msg"}
          >
            {message}
          </p>
        )}

        {isLogin ? (
          <form
            key="login-form"
            onSubmit={handleLogin}
            className="auth-form"
            autoComplete="off"
          >
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              autoComplete="off"
            /><br />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
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
            </div><br />
            <button type="submit" className="auth-btn">Login</button>
          </form>
        ) : (
          <form
            key="signup-form"
            onSubmit={handleSignup}
            className="auth-form"
            autoComplete="off"
          >
            <input
              type="text"
              placeholder="Full Name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              required
              autoComplete="off"
            /><br />
            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
              autoComplete="off"
            /><br />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
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
            </div><br />
            <button type="submit" className="auth-btn">Signup</button>
          </form>
        )}

        <p className="toggle-link">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleForm}>
            {isLogin ? "Signup here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
