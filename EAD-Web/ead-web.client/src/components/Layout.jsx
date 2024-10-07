import PropTypes from "prop-types";
import { useState,useContext } from "react";
import NavigationBar from "./Navbar";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import AuthContext from "../contexts/AuthContext";

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);

  console.log("user",user);

  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const [userRole, setUserRole] = useState("");

  // useEffect(() => {
  //   const storedUserRole = sessionStorage.getItem("role");


  //   if (storedUserRole) {
  //     setUserRole(storedUserRole);
  //   } else {
  //     setUserRole("guest");
  //   }
  // }, []);
  console.log("Stored user role",userRole);


  return (
    <>
        {user && (
        <div style={{ marginBottom: "100px" }}>
          <NavigationBar userRole={userRole} />
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
