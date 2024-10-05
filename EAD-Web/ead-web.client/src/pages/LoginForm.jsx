import React, { useState } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBInput
  }
  from 'mdb-react-ui-kit';
import { loginUser } from '../apis/login';

const LoginForm = () => {
  const[formData,setFormData] = useState({
    email: "",
    password: ""
  });

  //Hanlde input change
  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    });
  };

  //Handle form submission
  const handleSubmit = async (e) =>{
    e.preventDefault();

    try{
      await loginUser(formData); //Login user with from data
    }catch(error){
      console.error("Login request failed:",error);
    }
  }

  return (
    <MDBContainer className="my-5 gradient-form">
      <form onSubmit={handleSubmit}>

      <MDBRow>

        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">

            <div className="text-center">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                style={{width: '185px'}} alt="logo" />
              <h4 className="mt-1 mb-5 pb-1">We are The VendiCore Team</h4>
           

            <p >Please login to your account</p>

            </div>
            <MDBInput wrapperClass='mb-4' label='Email address' id='email' type='email'                  value={formData.email}
               onChange={handleChange}
            />
            <MDBInput wrapperClass='mb-4' label='Password' id='password' type='password'                 value={formData.password}
                onChange={handleChange}
            />


            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn className="mb-4 w-100 gradient-custom-2">Sign in</MDBBtn>
              <a className="text-muted" href="#!">Forgot password?</a>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account?</p>
              <MDBBtn outline className='mx-2' color='danger'>
                Create New
              </MDBBtn>
            </div>

          </div>

        </MDBCol>

<MDBCol col='6' className="mb-5">
  <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
    {/* <div className="text-white px-3 py-4 p-md-5 mx-md-4"> */}
      <img 
    src="https://static.vecteezy.com/system/resources/previews/029/840/418/large_2x/e-commerce-shopping-cart-with-multiple-products-a-sunlit-abstract-background-e-commerce-concept-ai-generative-free-photo.jpg"
    alt="E-commerce concept" 
        className="img-fluid"
      />
    </div>
  {/* </div> */}
</MDBCol>

      </MDBRow>
      </form>

    </MDBContainer>
  )
}

export default LoginForm
