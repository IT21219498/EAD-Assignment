import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import OrderManagement from "./pages/OrderManagement";
import Vendor from "./pages/Vendor";
import PendingUsers from "./pages/PendingUsers";
import CustomerActivation from "./pages/CustomerActivation";
import ReActivateCustomer from "./pages/ReActivateCustomer";
import OrderItemReady from "./pages/OrderItemReady";
import CancelRequests from "./pages/CancelRequests";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/Products" element={<Products />} />
      <Route path="/Inventory" element={<Inventory />} />
      <Route path="/Login" element={<LoginForm />} />
      <Route path="/Register" element={<RegisterForm />} />
      <Route path="/OrderManagement" element={<OrderManagement />} />
      <Route path="/Vendor" element={<Vendor />} />
      <Route path="/PendingUsers" element={<PendingUsers />} />
      <Route path="/CustomerActivation" element={<CustomerActivation />} />
      <Route path="/ReActivateCustomer" element={<ReActivateCustomer />} />
      <Route path="/ConfirmOrder" element={<OrderItemReady />} />
      <Route path="/CancelRequests" element={<CancelRequests />} />
    </Routes>
  );
};

export default AppRoutes;
