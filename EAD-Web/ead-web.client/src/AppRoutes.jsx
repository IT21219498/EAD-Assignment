import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/products' element={<Products />} />
      <Route path='/inventory' element={<Inventory />} />
    </Routes>
  );
};

export default AppRoutes;
