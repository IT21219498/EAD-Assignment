import { createContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewToastContext = createContext();

export const NewToastProvider = ({ children }) => {
  // Function to show toast notifications
  const showToast = (message, type = 'info') => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
    });
  };

  return (
    <NewToastContext.Provider value={{ showToast }}>
      {children}
      {/* ToastContainer to display toasts */}
      <ToastContainer />
    </NewToastContext.Provider>
  );
};

export default NewToastContext;
