import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import OrderManagement from "./pages/OrderManagement";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/Products" element={<Products />} />
      <Route path="/Inventory" element={<Inventory />} />
      <Route path="/OrderManagement" element={<OrderManagement />} />
    </Routes>
  );
};

export default AppRoutes;
