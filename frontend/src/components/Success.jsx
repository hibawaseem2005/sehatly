import { useEffect, useContext } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    // Extract session_id from URL
    const params = new URLSearchParams(location.search);
    const session_id = params.get("session_id");

    if (!session_id) return;

    // Verify payment with backend
    fetch(`http://localhost:5000/api/payments/verify-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.paid) {
          // Clear localStorage and React state
          localStorage.removeItem("Cart");
          clearCart();
        }
      })
      .catch(err => console.error("Payment verification failed:", err));
  }, [location.search, clearCart]);

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          textAlign: "center",
          maxWidth: 500,
          borderRadius: 3,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 70, color: "green", mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Payment Successful 🎉
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your order has been placed successfully.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/")}>
          Go to Homepage
        </Button>
      </Paper>
    </Box>
  );
}
