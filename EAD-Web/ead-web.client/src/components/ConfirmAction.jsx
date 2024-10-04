import { Modal, Button } from "react-bootstrap";
import propTypes from "prop-types";

const ConfirmAction = ({
  show,
  onHide,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmAction;

ConfirmAction.propTypes = {
  show: propTypes.bool.isRequired,
  onHide: propTypes.func.isRequired,
  onConfirm: propTypes.func.isRequired,
  title: propTypes.string,
  message: propTypes.string,
  confirmLabel: propTypes.string,
  cancelLabel: propTypes.string,
  confirmVariant: propTypes.string,
};
