import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MedicinesList from "./MedicinesList";
import Auth from "./components/Auth";
import Checkout from "./components/checkout";
import Cart from "./components/Cart";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AddMedicine from "./components/AddMedicine";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import MyOrders from "./components/MyOrders";


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />

          <Routes>
            {/* Customer routes */}
            <Route path="/" element={<MedicinesList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Auth />} />

            <Route path="/my-orders" element={<MyOrders />} /> 
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Vendor/Admin Add Medicine */}
            <Route path="/add-medicine" element={<AddMedicine />} />
          </Routes>

        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
