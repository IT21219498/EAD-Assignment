import { createContext, useState } from "react";
import propTypes from "prop-types";
import ToastMessage from "../components/ToastMessage";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [toastMessage, setToastMessage] = useState("");
  const [toastPosition, setToastPosition] = useState("top-end");

  const handleToastClose = () => {
    setShowToast(false);
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        setShowToast,
        toastTitle,
        setToastTitle,
        toastVariant,
        setToastVariant,
        toastMessage,
        setToastMessage,
        toastPosition,
        setToastPosition,
        handleToastClose,
      }}
    >
      {children}
      <ToastMessage
        show={showToast}
        handleClose={handleToastClose}
        title={toastTitle}
        message={toastMessage}
        variant={toastVariant}
        position={toastPosition}
      />
    </ToastContext.Provider>
  );
};

// Validate prop types
ToastProvider.propTypes = {
  children: propTypes.node.isRequired,
};

export default ToastContext;
