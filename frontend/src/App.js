import React from "react";
import MedicinesList from "./MedicinesList";
import Auth from "./components/Auth";
import Checkout from "./components/checkout";
import Cart from "./components/Cart";


function App() {
  return (
    <div>
      <MedicinesList />
      <Cart/>
      <Auth />
      <Checkout/>
    </div>
  );
}

export default App;
