import { useContext, useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import logo from "../assets/EADlogo.png";
import { FaRegUserCircle } from "react-icons/fa";
import AuthContext from "../contexts/AuthContext";
import {  useNavigate } from "react-router-dom";



const NavigationBar = () => {
  const navigate = useNavigate();

  const { user, setUser,logoutUser } = useContext(AuthContext);

  // useEffect hook to redirect to login if user is not authenticated
  useEffect(() => {
    !user && navigate("/login", { replace: true });
  }, []);

  const handleLogout = (e) => {
    e.preventDefault(); // Prevent default action to avoid page refresh
    logoutUser(); 
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">
          <img
            src={logo}
            height="60"
            className="d-inline-block align-top"
            alt="EAD Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Common Links */}
            <Nav.Link href="/">Home</Nav.Link>
            {user && user?.role === "Admin" && (
              <>
                {/* Admin-Specific Links */}
                <NavDropdown
                  title="Order Management"
                  id="order-management-dropdown"
                >
                  <NavDropdown.Item href="/OrderManagement">
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/ConfirmOrder">
                    Ready Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/CancelRequests">
                    Cancel Requests
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {user && user.role === "Admin" && (
              <>
                {/* Admin-Specific Links */}
                <NavDropdown
                  title="Admin Management"
                  id="admin-management-dropdown"
                >
                  <NavDropdown.Item href="/Products">
                    Product Management
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/Inventory">
                    Inventory Management
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/Vendor">
                    Vendor Management
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {user && user.role === "Admin" && (
              <>
                {/* Admin-Specific Links */}
                <NavDropdown
                  title="Account Management"
                  id="user-management-dropdown"
                >
                  <NavDropdown.Item href="/PendingUsers">
                    Vendor Account Management
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/CustomerActivation">
                    Customer Account Management
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {user && user.role === "Vendor" && (
              <>
                {/* Vendor-Specific Links */}
                <NavDropdown
                  title="Vendor Management"
                  id="vendor-management-dropdown"
                >
                  <NavDropdown.Item href="/Products">
                    Product Management
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/Inventory">
                    Inventory Management
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {user && user.role === "CSR" && (
              <>
                {/* CSR-Specific Links */}
                <Nav.Link href="#customer-orders">
                  Customer Order Management
                </Nav.Link>
                <NavDropdown
                  title="Account Management"
                  id="csr-management-dropdown"
                >
                  <NavDropdown.Item href="/CustomerActivation">
                    Customer Account Management
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/ReActivateCustomer">
                    Account Re-Activation Management
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
          <Nav className="ms-auto">
            <NavDropdown
              title={<FaRegUserCircle size="1.5em" />}
              id="profile-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
