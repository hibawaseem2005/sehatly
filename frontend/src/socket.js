// src/socket.js
import { io } from "socket.io-client";
import { API_URL } from "./config";

const adminToken = localStorage.getItem("adminToken");

const socket = io(`${API_URL}`, {
  withCredentials: true,
  extraHeaders: {
    Authorization: `Bearer ${adminToken}`,
  },
  autoConnect: false, // we connect manually in the dashboard
});

export default socket;
