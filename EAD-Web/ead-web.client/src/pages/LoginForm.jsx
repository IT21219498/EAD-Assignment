import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { Link } from "react-router-dom";
import Logo from '../assets/EADlogo.png';
import NewToastContext from '../contexts/NewToastContext';


const LoginForm = () => {
  const { loginUser } = useContext(AuthContext);
  const { showToast } = useContext(NewToastContext); 

  const[formData,setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate(); 

    


  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    });
  };
    const handleCreateNew = () => {
      navigate('/register');
    };

  const handleSubmit = async (e) =>{
    e.preventDefault();

    try{
      const response = await loginUser(formData); 
      if (response.ok) {
        showToast('Login successful!', 'success'); 
        navigate('/'); 
      }else{
        showToast('Invalid credentials. Please try again.', 'error'); 
      }
        }catch(error){
      console.error("Login request failed:",error);
      showToast('Login failed. Please try again.', 'error'); 

    }
  }

  return (
<div className="container  p-4">
<form
        className="mx-auto p-5 m-5  border border-light-subtle rounded shadow w-50 "
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
           <p >Please login to your account</p>

        </div>
        
        <div className="form-group">
          <label htmlFor="inputEmail" className="form-label ">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            label='Email address' id='email'    
            value={formData.email}   
                     onChange={handleChange}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="form-group">
          <label htmlFor="passwordInput" 
          className="form-label mt-2">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            label='Password' id='password'                 
             value={formData.password}
                onChange={handleChange}
          />
        </div>
        <div className="text-center ">
          <button
            type="submit"
            className="btn  mt-5 text-white w-25"
            style={{ backgroundColor: "#0455bf" }}
          >
            Login
          </button>
        </div>
        <p className='mt-2'>
          Don't have an account ?{" "}
          <Link to="/register" style={{ textDecoration: "#0455bf" }}>
            Create an account
          </Link>
        </p>
        </form>
        

</div>
  )
}

export default LoginForm
