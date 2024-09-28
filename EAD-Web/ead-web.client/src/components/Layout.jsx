import PropTypes from "prop-types";
import { useState } from "react";
import NavigationBar from "./Navbar";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const [userRole, setUserRole] = useState("Administrator");

  useEffect(() => {
    setUserRole("Administrator");
  }, []);
  return (
    <>
      <NavigationBar userRole={userRole} />
      <main className='container mt-4'>{children}</main>
    </>
  );
};

//validate prop types
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
