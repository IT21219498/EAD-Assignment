import { Toast, ToastContainer } from "react-bootstrap";
import Proptypes from "prop-types";

const ToastMessage = ({
  show,
  handleClose,
  title,
  message,
  variant = "success",
  position = "top-end",
}) => {
  // console.log(variant);
  return (
    <ToastContainer position={position} className='p-3'>
      <Toast
        onClose={handleClose}
        show={show}
        bg={variant}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className='me-auto'>{title}</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastMessage;

ToastMessage.propTypes = {
  show: Proptypes.bool,
  handleClose: Proptypes.func,
  title: Proptypes.string,
  message: Proptypes.string,
  variant: Proptypes.string,
  position: Proptypes.string,
};
