import React, { useState,useContext } from "react";

import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
// import { registerUser } from "../apis/register";
import { Link } from "react-router-dom";
import Logo from '../assets/EADlogo.png';
import AuthContext from '../contexts/AuthContext';
import NewToastContext from "../contexts/NewToastContext";


const RegisterForm = () => {
  const { registerUser } = useContext(AuthContext);
  const { showToast } = useContext(NewToastContext); // Use the toast context

  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "Vendor",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle role change for radio buttons
  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the form from refreshing the page
    console.log("Form submission started...");

        // Password validation
        const { password ,role} = formData;
        const passwordRequirements = [
          { test: /[0-9]/, message: "Passwords must have at least one digit ('0'-'9')." },
          { test: /[A-Z]/, message: "Passwords must have at least one uppercase ('A'-'Z')." },
          { test: /[^a-zA-Z0-9]/, message: "Passwords must have at least one non-alphanumeric character." },
        ];
    
        for (const requirement of passwordRequirements) {
          if (!requirement.test.test(password)) {
            showToast(requirement.message, 'warning');
            return;
          }
        }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      // alert("Passwords do not match!");
      showToast('Passwords do not match!', 'warning'); // Show error toast

      return;
    }

    // Create a new object excluding confirmPassword
    const { confirmPassword, ...dataToSend } = formData;

    console.log("Data to send:", dataToSend);

    try {
      const response = await registerUser(dataToSend); // Register user with form data
console.log("Reg Response",response);
      if (response.ok) {
        // alert("Registration successful!");
        if(role == "Vendor"){
          showToast('Account is pending approval.', 'success'); // Show error toast
        }else{
          showToast('Account created successfully!','success'); // Show error toast
        }
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        alert("Registration failed. Please try again."); // Handle unsuccessful registration
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
 
    <div className="container  p-4">
<form
        className="mx-auto p-5 m-5  border border-light-subtle rounded shadow w-50 needs-validation"
        onSubmit={handleSubmit}
        
      >
          <div className="text-center">
          <img
            className="mb-4"
            src={Logo}
            alt="Logo"
            style={{ maxWidth: "300px" }}
          />
           <h4 className="mt-1 mb-5 pb-1">We are The VendiCore Team</h4>
           <p >Please Register your account</p>

        </div>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="inputEmail" className="form-label ">
            Full Name
          </label>
          <input
            className="form-control"
            label="Full Name"
                            id="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
            aria-describedby="emailHelp"
          />

        </div>
        <div className="form-group">
          <label htmlFor="inputEmail" className="form-label ">
            Email address
          </label>
          <input
            className="form-control"
        
            aria-describedby="emailHelp"
            label="Email address"
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="inputEmail" className="form-label ">
            Phone Number
          </label>
          <input
            className="form-control"
        
            aria-describedby="emailHelp"
            label="Phone Number"
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
          />
        </div>
        <div className="form-group">
          <label htmlFor="inputEmail" className="form-label ">
            Address
          </label>
          <input
            className="form-control"
        
            aria-describedby="emailHelp"
            label="Address"
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    required
          />
        </div>
        <div className="form-group">
          <label htmlFor="passwordInput" 
          className="form-label mt-2">
            Password
          </label>
          <input
            className="form-control"
            label="Password"
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="passwordInput" 
          className="form-label mt-2">
           Confirm  Password
          </label>
          <input
            className="form-control"
            label="Confirm Password"
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
          />
        </div>

  <div className="form-group">
          <label htmlFor="passwordInput" 
          className="form-label mt-2">
           Select Role
          </label>
<div class="form-check">
  <input class="form-check-input" type="radio" name="role" id="Vendor" value="Vendor" checked={formData.role === "Vendor"} onChange={handleRoleChange} />
  <label class="form-check-label" for="flexRadioDefault1">
   Vendor
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="role" id="CSR" value="CSR" checked={formData.role === "CSR"} onChange={handleRoleChange} />
  <label class="form-check-label" for="flexRadioDefault2">
    CSR
  </label>
</div>
</div>



        <div className="text-center ">
          <button
            type="submit"
            className="btn  mt-5 text-white w-25"
            style={{ backgroundColor: "#0455bf" }}
          >
            Sign Up
          </button>
        </div>
        <p className='mt-2'>
        Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "#0455bf" }}>
            Sign In
          </Link>
        </p>
        </form>
</div>
  );
};

export default RegisterForm;















