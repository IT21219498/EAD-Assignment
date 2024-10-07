// src/components/Navbar.jsx

import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import proptype from "prop-types";
import logo from "../assets/EADlogo.png";
import { FaRegUserCircle } from "react-icons/fa";

const NavigationBar = ({ userRole }) => {
  const handleLogout = () => {
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
            {userRole === "Administrator" && (
              <>
                {/* Administrator-Specific Links */}
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
                </NavDropdown>
              </>
            )}

            {userRole === "Administrator" && (
              <>
                {/* Administrator-Specific Links */}
                <NavDropdown
                  title="Admin Management"
                  id="admin-management-dropdown"
                >
                  <NavDropdown.Item href="#user-management">
                    User Management
                  </NavDropdown.Item>
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

            {userRole === "Vendor" && (
              <>
                {/* Vendor-Specific Links */}
                <NavDropdown
                  title="Vendor Management"
                  id="vendor-management-dropdown"
                >
                  <NavDropdown.Item href="#product-management">
                    Product Management
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#inventory-management">
                    Inventory Management
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {userRole === "CSR" && (
              <>
                {/* CSR-Specific Links */}
                <Nav.Link href="#customer-orders">
                  Customer Order Management
                </Nav.Link>
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
