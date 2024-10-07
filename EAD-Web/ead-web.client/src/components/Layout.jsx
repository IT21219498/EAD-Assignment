import PropTypes from "prop-types";
import { useState,useContext } from "react";
import NavigationBar from "./Navbar";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import AuthContext from "../contexts/AuthContext";

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);

  console.log("user data",user);

  const navigate = useNavigate(); // Initialize useNavigate for redirection




  return (
    <>
        {user && (
        <div style={{ marginBottom: "100px" }}>
          <NavigationBar  />
        </div>
      )}
{/* {['Admin', 'Vendor', 'CSR'].includes(userRole) && <NavigationBar userRole={userRole} />} */}
{/* <NavigationBar userRole={userRole} /> */}
      <main className=' mt-4'>{children}</main>
    </>
  );
};

//validate prop types
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
