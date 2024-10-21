import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (!user) {
      Cookies.remove(".AspNetCore.Identity.Application");

      checkUserLoggedIn();
    }
  }, [navigate]);

  const checkUserLoggedIn = async () => {
    try {
      const token = sessionStorage.getItem("token"); 
      const response = await fetch("/api/User/chk", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const { userId, role } = userData;
        setUser({ userId, role });
      } else {
        setUser(null);
        sessionStorage.clear();
        // navigate("/login", { replace: true });
      }
    } catch (err) {
      setUser(null);
      sessionStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  //Login Request
  const loginUser = async (loginModel) => {
    try {
      const response = await fetch("/api/User/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginModel),
      });

      if (response.ok) {
        const result = await response.json();
        const { token, userId, role } = result;

        sessionStorage.setItem("token", token);

        setUser({ userId, role });

        return response;
      } else {
        const error = await response.json();
        return error;
      }
    } catch (error) {
      throw error; // Propagate the error
    }
  };

  //register request
  const registerUser = async (registerModel) => {
    try {
      const response = await fetch("/api/User/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerModel),
      });

      if (response.ok) {
        const result = await response.json(); // Parse JSON response
       
        return response;
      } else {
        const error = await response.json(); // Parse the error response
        return error;
      }
    } catch (error) {
      return error;
    }
  };

// Logout Request
const logoutUser = async () => {
  console.log("Logout triggered");
  
  try {
    const token = sessionStorage.getItem("token"); 
    const response = await fetch("/api/User/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`, 
      },
    });

    if (response.ok) {
      sessionStorage.removeItem("token");
      setUser(null);
      Cookies.remove(".AspNetCore.Identity.Application");
      navigate("/login", { replace: true });
    } else {
      const error = await response.json();
      console.error("Logout error:", error);
      return error; 
    }
  } catch (error) {
    console.error("Logout request failed:", error);
    return error; 
  }
};


  return (
    <AuthContext.Provider value={{ loginUser, registerUser, user, setUser,logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
