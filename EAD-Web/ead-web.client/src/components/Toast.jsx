import PropTypes from "prop-types";
import { Toast as BsToast } from "react-bootstrap";

export default function Toast({
  variant,
  showToast,
  title,
  message,
  handleClose,
}) {
  console.log("🚀 ~ Toast ~ showToast:", showToast);
  title = title === "danger" ? "Error" : title;
  return (
    <BsToast
      bg={variant}
      onClose={handleClose}
      show={showToast}
      delay={5000}
      autohide
      style={{
        zIndex: 9999, // Increased z-index
        position: "fixed", // Ensure it's positioned relative to the viewport
        top: 20, // Adjust top position as needed
        right: 20, // Adjust right position as needed
      }}
    >
      <BsToast.Header>
        <strong className="me-auto text-capitalize">{title}</strong>
      </BsToast.Header>
      <BsToast.Body style={{ whiteSpace: "pre-wrap" }}>{message}</BsToast.Body>
    </BsToast>
  );
}

Toast.propTypes = {
  variant: PropTypes.oneOf(["success", "warning", "danger"]).isRequired,
  showToast: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};
