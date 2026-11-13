// Base URL of the backend. Set REACT_APP_API_URL on Vercel (no trailing slash).
export const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
