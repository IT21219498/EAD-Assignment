import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/Products' element={<Products />} />
      <Route path='/Inventory' element={<Inventory />} />
      <Route path='/Login' element={<LoginForm />} />
      <Route path='/Register' element={<RegisterForm />} />

    </Routes>
  );
};

export default AppRoutes;
