// src/components/Navbar.jsx

import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import proptype from "prop-types";
import logo from "../assets/EADlogo.png";

const NavigationBar = ({ userRole }) => {
  return (
    <Navbar bg='light' expand='lg'>
      <Navbar.Brand href='/'>
        <img
          src={logo}
          height='60'
          className='d-inline-block align-top'
          alt='EAD Logo'
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='me-auto'>
          {/* Common Links */}
          <Nav.Link href='/'>Home</Nav.Link>
          <Nav.Link href='#orders'>Order Management</Nav.Link>
          {userRole === "Administrator" && (
            <>
              {/* Administrator-Specific Links */}
              <NavDropdown
                title='Admin Management'
                id='admin-management-dropdown'
              >
                <NavDropdown.Item href='#user-management'>
                  User Management
                </NavDropdown.Item>
                <NavDropdown.Item href='/products'>
                  Product Management
                </NavDropdown.Item>
                <NavDropdown.Item href='#inventory-management'>
                  Inventory Management
                </NavDropdown.Item>
                <NavDropdown.Item href='#vendor-management'>
                  Vendor Management
                </NavDropdown.Item>
              </NavDropdown>
            </>
          )}

          {userRole === "Vendor" && (
            <>
              {/* Vendor-Specific Links */}
              <NavDropdown
                title='Vendor Management'
                id='vendor-management-dropdown'
              >
                <NavDropdown.Item href='#product-management'>
                  Product Management
                </NavDropdown.Item>
                <NavDropdown.Item href='#inventory-management'>
                  Inventory Management
                </NavDropdown.Item>
              </NavDropdown>
            </>
          )}

          {userRole === "CSR" && (
            <>
              {/* CSR-Specific Links */}
              <Nav.Link href='#customer-orders'>
                Customer Order Management
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

NavigationBar.propTypes = {
  userRole: proptype.string.isRequired,
};

export default NavigationBar;
