import React from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio 
} from "mdb-react-ui-kit";
import { registerUser } from "./Register"; // Import the registerUser function


const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "Vendor", // Default value
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
      e.preventDefault();
      // Check if passwords match before calling registerUser
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
  
      try {
        await registerUser(formData); // Pass form data to registerUser
      } catch (error) {
        console.error("Registration failed:", error);
      }
    };

  return (
    <MDBContainer className="my-5 gradient-form">
      <form onSubmit={handleSubmit}>
        <MDBRow>
          <MDBCol col="6" className="mb-2">
            <div className="d-flex flex-column ms-5">
              <div className="text-center">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                  style={{ width: "185px" }}
                  alt="logo"
                />
                <h4 className="mt-1 mb-2 pb-1">We are The VendiCore Team</h4>
                <p>Please Register to your account</p>
              </div>
              <MDBInput
                wrapperClass="mb-4"
                label="Full Name"
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Email address"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Phone Number"
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Address"
                id="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <div className="mb-4">
                <label className="form-label">Select Role</label>
                <div>
                  <MDBRadio
                    name="role"
                    id="Vendor"
                    label="Vendor"
                    value="Vendor"
                    checked={formData.role === "Vendor"}
                    onChange={handleRoleChange}
                  />
                  <MDBRadio
                    name="role"
                    id="CSR"
                    label="CSR"
                    value="CSR"
                    checked={formData.role === "CSR"}
                    onChange={handleRoleChange}
                  />
                </div>
              </div>
              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn className="mb-4 w-100 gradient-custom-2" type="submit">
                  Sign Up
                </MDBBtn>
              </div>
              <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                <p className="mb-0">Already have an account?</p>
                <MDBBtn outline className="mx-2" color="danger">
                  Sign In
                </MDBBtn>
              </div>
            </div>
          </MDBCol>

          <MDBCol col="6" className="mb-5">
            <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
              <img
                src="https://static.vecteezy.com/system/resources/previews/029/840/418/large_2x/e-commerce-shopping-cart-with-multiple-products-a-sunlit-abstract-background-e-commerce-concept-ai-generative-free-photo.jpg"
                alt="E-commerce concept"
                className="img-fluid"
              />
            </div>
          </MDBCol>
        </MDBRow>
      </form>
    </MDBContainer>
  );
};

export default RegisterForm;
