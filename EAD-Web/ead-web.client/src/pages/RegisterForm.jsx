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




















// import React, { useState } from "react";
// import {
//   MDBBtn,
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBInput,
//   MDBRadio,
//   MDBValidation,
//   MDBValidationItem,
// } from "mdb-react-ui-kit";
// import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
// import { registerUser } from "../apis/register";

// const RegisterForm = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     address: "",
//     password: "",
//     confirmPassword: "",
//     role: "Vendor",
//   });
//   const navigate = useNavigate(); // Initialize useNavigate for redirection

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };

//   // Handle role change for radio buttons
//   const handleRoleChange = (e) => {
//     setFormData({
//       ...formData,
//       role: e.target.value,
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Handle submit 1");


//     // Check if passwords match
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     // Create a new object excluding confirmPassword
//     const { confirmPassword, ...dataToSend } = formData;

//     console.log("dataToSend", dataToSend);

//     try {
//       const response = await registerUser(dataToSend); // Register user with form data

//       if (response.ok) {
//         alert("Registration successful!");
//         // navigate('/login'); // Redirect to login page after successful registration
//       } else {
//         alert("Registration failed. Please try again."); // Handle unsuccessful registration
//       }
//     } catch (error) {
//       console.error("Registration failed:", error);
//     }
//   };

//   return (
//     <MDBValidation>
//       <MDBValidationItem>
//         <MDBContainer className="my-5 gradient-form">
//           <form onSubmit={handleSubmit}>
//             <MDBRow>
//               <MDBCol col="6" className="mb-2">
//                 <div className="d-flex flex-column ms-5">
//                   <div className="text-center">
//                     <img
//                       src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
//                       style={{ width: "185px" }}
//                       alt="logo"
//                     />
//                     <h4 className="mt-1 mb-2 pb-1">We are The VendiCore Team</h4>
//                     <p>Please Register to your account</p>
//                   </div>
//                   <MDBInput
//                     wrapperClass="mb-4"
//                     label="Full Name"
//                     id="fullName"
//                     type="text"
//                     value={formData.fullName}
//                     onChange={handleChange}
//                     required
//                   />
//                   <MDBInput
//                     wrapperClass="mb-4"
//                     label="Email address"
//                     id="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                   <MDBInput
//                     wrapperClass="mb-4"
//                     label="Phone Number"
//                     id="phoneNumber"
//                     type="tel"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                     required
//                   />
//                   <MDBInput
//                     wrapperClass="mb-4"
//                     label="Address"
//                     id="address"
//                     type="text"
//                     value={formData.address}
//                     onChange={handleChange}
//                     required
//                   />
//                   <MDBInput
//                     wrapperClass="mb-4"
//                     label="Password"
//                     id="password"
//                     type="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                   />
//                   <MDBInput
//                     wrapperClass="mb-4"
//                     label="Confirm Password"
//                     id="confirmPassword"
//                     type="password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     required
//                   />
//                   <div className="mb-4">
//                     <label className="form-label">Select Role</label>
//                     <div>
//                       <MDBRadio
//                         name="role"
//                         id="Vendor"
//                         label="Vendor"
//                         value="Vendor"
//                         checked={formData.role === "Vendor"}
//                         onChange={handleRoleChange}
//                       />
//                       <MDBRadio
//                         name="role"
//                         id="CSR"
//                         label="CSR"
//                         value="CSR"
//                         checked={formData.role === "CSR"}
//                         onChange={handleRoleChange}
//                       />
//                     </div>
//                   </div>
//                   <div className="text-center pt-1 mb-5 pb-1">
//                     <MDBBtn className="mb-4 w-100 gradient-custom-2" type="submit">
//                       Sign Up
//                     </MDBBtn>
//                   </div>
//                   <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
//                     <p className="mb-0">Already have an account?</p>
//                     <MDBBtn outline className="mx-2" color="danger" onClick={() => navigate('/login')}>
//                       Sign In
//                     </MDBBtn>
//                   </div>
//                 </div>
//               </MDBCol>

//               <MDBCol col="6" className="mb-5">
//                 <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
//                   <img
//                     src="https://static.vecteezy.com/system/resources/previews/029/840/418/large_2x/e-commerce-shopping-cart-with-multiple-products-a-sunlit-abstract-background-e-commerce-concept-ai-generative-free-photo.jpg"
//                     alt="E-commerce concept"
//                     className="img-fluid"
//                   />
//                 </div>
//               </MDBCol>
//             </MDBRow>
//           </form>
//         </MDBContainer>
//       </MDBValidationItem>
//     </MDBValidation>
//   );
// };

// export default RegisterForm;























// // import React, { useState } from "react";
// // import {
// //   MDBBtn,
// //   MDBContainer,
// //   MDBRow,
// //   MDBCol,
// //   MDBInput,
// //   MDBRadio,
// //   MDBValidation,
// //   MDBValidationItem,
// // } from "mdb-react-ui-kit";
// // import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// // import { registerUser } from "../apis/register";

// // const RegisterForm = () => {
// //   const [formData, setFormData] = useState({
// //     fullName: "",
// //     email: "",
// //     phoneNumber: "",
// //     address: "",
// //     password: "",
// //     confirmPassword: "",
// //     role: "Vendor",
// //   });
// //   const navigate = useNavigate(); // Initialize useNavigate for redirection

// //   // Handle input changes
// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.id]: e.target.value,
// //     });
// //   };

// //   // Handle role change for radio buttons
// //   const handleRoleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       role: e.target.value,
// //     });
// //   };

// //   // Handle form submission
// //   const handleSubmit = async (e) => {
// //     console.log("Handle submit 1");
// //     e.preventDefault();

// //     // Check if passwords match
// //     if (formData.password !== formData.confirmPassword) {
// //       alert("Passwords do not match!");
// //       return;
// //     }

// //     // Create a new object excluding confirmPassword
// //     const { confirmPassword, ...dataToSend } = formData;

// //     console.log("dataToSend",dataToSend);

// //     try {
// //       const response = await registerUser(dataToSend); // Register user with form data
      
// //       if (response.ok) {
// //         alert("Registration successful!");
// //         // navigate('/login'); // Redirect to login page after successful registration
// //       }      alert("Registration successful!");
// //     } catch (error) {
// //       console.error("Registration failed:", error);
// //     }
// //   };

// //   console.log("check");

// //   return (
// //     <MDBValidation>
// //       <MDBValidationItem>

// //     <MDBContainer className="my-5 gradient-form">
// //       <form onSubmit={handleSubmit}>
// //         <MDBRow>
// //           <MDBCol col="6" className="mb-2">
// //             <div className="d-flex flex-column ms-5">
// //               <div className="text-center">
// //                 <img
// //                   src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
// //                   style={{ width: "185px" }}
// //                   alt="logo"
// //                 />
// //                 <h4 className="mt-1 mb-2 pb-1">We are The VendiCore Team</h4>
// //                 <p>Please Register to your account</p>
// //               </div>
// //               <MDBInput
// //                 wrapperClass="mb-4"
// //                 label="Full Name"
// //                 id="fullName"
// //                 type="text"
// //                 value={formData.fullName}
// //                 onChange={handleChange}
// //                 required
// //               />
// //               <MDBInput
// //                 wrapperClass="mb-4"
// //                 label="Email address"
// //                 id="email"
// //                 type="email"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //               />
// //               <MDBInput
// //                 wrapperClass="mb-4"
// //                 label="Phone Number"
// //                 id="phoneNumber"
// //                 type="tel"
// //                 value={formData.phoneNumber}
// //                 onChange={handleChange}
// //               />
// //               <MDBInput
// //                 wrapperClass="mb-4"
// //                 label="Address"
// //                 id="address"
// //                 type="text"
// //                 value={formData.address}
// //                 onChange={handleChange}
// //               />
// //               <MDBInput
// //                 wrapperClass="mb-4"
// //                 label="Password"
// //                 id="password"
// //                 type="password"
// //                 value={formData.password}
// //                 onChange={handleChange}
// //               />
// //               <MDBInput
// //                 wrapperClass="mb-4"
// //                 label="Confirm Password"
// //                 id="confirmPassword"
// //                 type="password"
// //                 value={formData.confirmPassword}
// //                 onChange={handleChange}
// //               />
// //               <div className="mb-4">
// //                 <label className="form-label">Select Role</label>
// //                 <div>
// //                   <MDBRadio
// //                     name="role"
// //                     id="Vendor"
// //                     label="Vendor"
// //                     value="Vendor"
// //                     checked={formData.role === "Vendor"}
// //                     onChange={handleRoleChange}
// //                   />
// //                   <MDBRadio
// //                     name="role"
// //                     id="CSR"
// //                     label="CSR"
// //                     value="CSR"
// //                     checked={formData.role === "CSR"}
// //                     onChange={handleRoleChange}
// //                   />
// //                 </div>
// //               </div>
// //               <div className="text-center pt-1 mb-5 pb-1">
// //                 <MDBBtn className="mb-4 w-100 gradient-custom-2" type="submit">
// //                   Sign Up
// //                 </MDBBtn>
// //               </div>
// //               <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
// //                 <p className="mb-0">Already have an account?</p>
// //                 <MDBBtn outline className="mx-2" color="danger">
// //                   Sign In
// //                 </MDBBtn>
// //               </div>
// //             </div>
// //           </MDBCol>

// //           <MDBCol col="6" className="mb-5">
// //             <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
// //               <img
// //                 src="https://static.vecteezy.com/system/resources/previews/029/840/418/large_2x/e-commerce-shopping-cart-with-multiple-products-a-sunlit-abstract-background-e-commerce-concept-ai-generative-free-photo.jpg"
// //                 alt="E-commerce concept"
// //                 className="img-fluid"
// //               />
// //             </div>
// //           </MDBCol>
// //         </MDBRow>
// //       </form>
// //     </MDBContainer>
// //     </MDBValidationItem>
// //     </MDBValidation>
// //   );
// // };

// // export default RegisterForm;
