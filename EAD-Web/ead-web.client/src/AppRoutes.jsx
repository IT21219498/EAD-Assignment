import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProductManagement from "./pages/Products";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/products' element={<ProductManagement />} />
    </Routes>
  );
};

export default AppRoutes;
