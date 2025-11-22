import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MedicinesList from "./MedicinesList";
import Auth from "./components/Auth";
import Cart from "./components/Cart";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AddMedicine from "./components/AddMedicine";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import MyOrders from "./components/MyOrders";
import VendorLogin from "./components/VendorLogin";
import About from "./components/About";
import Contact from "./components/Contact";
import WorkWithSehatly from "./components/WorkWithSehatly";
import Notifications from "./components/Notifications";


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
            <Route path="/login" element={<Auth />} />

            <Route path="/my-orders" element={<MyOrders />} /> 
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Vendor/Admin Add Medicine */}
            <Route path="/vendor" element={<VendorLogin />} />
            <Route path="/vendor/dashboard" element={<AddMedicine />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/work-with-sehatly" element={<WorkWithSehatly />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>

        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
