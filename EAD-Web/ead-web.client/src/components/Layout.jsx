import PropTypes from "prop-types";
import { useState, useContext } from "react";
import NavigationBar from "./Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import AuthContext from "../contexts/AuthContext";

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);


  const navigate = useNavigate(); 

  return (
    <>
      {user && (
        <div style={{ marginBottom: "100px" }}>
          <NavigationBar />
        </div>
      )}
 
      <main className=" mt-4">{children}</main>
    </>
  );
};

//validate prop types
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
