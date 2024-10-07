// src/components/Navbar.jsx
import { useContext, useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import proptype from "prop-types";
import logo from "../assets/EADlogo.png";
import { FaRegUserCircle } from "react-icons/fa";
import AuthContext from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';


const NavigationBar = ({ userRole }) => {
  const navigate = useNavigate();

  console.log("User roleeee",userRole);
  const { user, setUser } = useContext(AuthContext);

    // useEffect hook to redirect to login if user is not authenticated
  useEffect(() => {
    !user && navigate('/login', { replace: true });
  }, []);

  const handleLogout = () => {
    setUser(null);
    // Clear the session storage
    sessionStorage.clear();
    // Redirect to the login page
    window.location.href = "/login";
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
            {user === "Admin" && (
              <>
                {/* Admin-Specific Links */}
                <NavDropdown
                  title="Order Management"
                  id="order-management-dropdown"
                >
                  <NavDropdown.Item href="/OrderManagement">
                    Orders
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {user === "Admin" && (
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

{user === "Admin" && (
              <>
                {/* Admin-Specific Links */}
                <NavDropdown
                  title="Account Management"
                  id="user-management-dropdown"
                >
                  <NavDropdown.Item href="PendingUsers">
                    Vendor Account  Management
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/CustomerActivation">
                    Customer Account Management
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {user === "Vendor" && (
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

            {user === "CSR" && (
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
                  </NavDropdown.Item >
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

NavigationBar.propTypes = {
  userRole: proptype.string.isRequired,
};

export default NavigationBar;
