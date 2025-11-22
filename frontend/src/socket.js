// src/socket.js
import { io } from "socket.io-client";

const adminToken = localStorage.getItem("adminToken");

const socket = io("http://localhost:5000", {
  withCredentials: true,
  extraHeaders: {
    Authorization: `Bearer ${adminToken}`,
  },
  autoConnect: false, // we connect manually in the dashboard
});

export default socket;
