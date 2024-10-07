import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  console.log("🚀 ~ AuthContextProvider ~ user:", user);
  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
        if (!user) {
            checkUserLoggedIn();
        }
    }, [ navigate]);

  const checkUserLoggedIn = async () => {
    try {
      console.log("Check user session storage ", sessionStorage);
      const token = sessionStorage.getItem("token"); // Retrieve the token

      const response = await fetch("/api/User/chk", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });

        if (response.ok) {
            const userData = await response.json();
            console.log('User Data:', userData);
            const { userId, role } = userData;

            // setUser({userId,role});
        //     if (
        //         location.pathname === '/login' ||
        //         location.pathname === '/register'
        //       ) {
        //         setTimeout(() => {
        //           navigate('/', { replace: true });
        //         }, 500);
        //       } else {
        //         navigate(location.pathname ? location.pathname : '/');
        //   }
         }

        else {
            setUser(null);
            sessionStorage.clear();
            navigate('/login', { replace: true });
        }

    }  catch(err){
        setUser(null);
        sessionStorage.clear();
        console.log(err);
        navigate('/login', { replace: true });
    }
  };

    //Login Request
     const loginUser = async (loginModel) => {
        try {
            const response = await fetch('/api/User/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginModel),
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log("Login successful:", result);
                const { token, userId, role } = result;
    
                sessionStorage.setItem('token', token);
                // sessionStorage.setItem('userId', userId);
                // sessionStorage.setItem('role', role);

                setUser({userId,role});

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("role", role);

        setUser(role);

        return response;
      } else {
        const error = await response.json();
        console.error("Login error:", error);
        return error;
      }
    } catch (error) {
      console.error("Request failed:", error);
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
        console.log("Success:", result.message); // Access the 'message' field
        return response;
      } else {
        const error = await response.json(); // Parse the error response
        console.error("Error:", error);
        return error;
      }
    } catch (error) {
      console.error("Request failed:", error);
      return error;
    }
  };

  return (
    <AuthContext.Provider value={{ loginUser, registerUser, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
