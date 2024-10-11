import { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  ListGroupItem,
  Modal,
  OverlayTrigger,
  Pagination,
  Row,
  Spinner,
  Table,
  Tooltip,
} from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { HiMiniBellAlert } from "react-icons/hi2";
import {
  fetchInventory,
  fetchLowStock,
  updateStock,
  deleteStock,
} from "../apis/inventory";
import ToastContext from "../contexts/ToastContext";
import { RiDeleteBin5Line } from "react-icons/ri";
import ConfirmAction from "../components/ConfirmAction";

// Mock Data for Inventory Items

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStockAlert, setLowStockAlert] = useState([]);
  const {
    setShowToast,
    setToastTitle,
    setToastVariant,
    setToastMessage,
    setToastPosition,
  } = useContext(ToastContext);
  const [showModal, setShowModal] = useState(false);
  const [stockForm, setStockForm] = useState({
    id: "",
    productName: "",
    sellingPrice: "",
    openingStock: "",
    newStock: "",
    closeStock: "",
  });
  const [formErrors, setFormErrors] = useState({
    openingStock: false,
    newStock: false,
    closeStock: false,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of products to show per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInventory = inventory.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(inventory.length / itemsPerPage);
  const [showProducts, setShowProducts] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const handleToggleProducts = () => {
    setShowProducts(!showProducts);
  };

  const handleShowToast = (title, message, variant) => {
    setShowToast(true);
    setToastTitle(title);
    setToastMessage(message);
    setToastVariant(variant);
    setToastPosition("top-end");
  };

  useEffect(() => {
    Promise.all([loadInventory(), loadLowStock()]);
  }, []);

  const handleShowConfirm = (type, id) => {
    setActionType(type);
    setShowConfirm(true);
    setSelectedStock(id);
  };

  const loadInventory = async () => {
    setShowSpinner(true);
    try {
      const data = await fetchInventory();
      setInventory(data);
    } catch (error) {
      handleShowToast("Error", error.message, "danger");
    } finally {
      setShowSpinner(false);
    }
  };

  const loadLowStock = async () => {
    try {
      const data = await fetchLowStock();
      setLowStockAlert(data);
    } catch (error) {
      handleShowToast("Error", error.message, "danger");
    }
  };

  const handleStockUpdate = async () => {
    setShowSpinner(true);
    try {
      const newStock = {
        id: stockForm.id,
        quantity: stockForm.closeStock,
      };
      const response = await updateStock(newStock);
      if (response.error) {
        handleShowToast("Error", response.message, "danger");
      } else {
        handleShowToast("Success", "Stock updated successfully!", "success");
        handleModalClose();
        await loadInventory();
        await loadLowStock();
      }
    } catch (error) {
      console.error("Error:", error);
      handleShowToast("Error", error.message, "danger");
    } finally {
      setShowSpinner(false);
    }
  };

  const handleDeleteProduct = async () => {
    setShowSpinner(true);
    try {
      const response = await deleteStock(selectedStock);
      if (response.error) {
        handleShowToast("Error", response.message, "danger");
      } else {
        handleShowToast("Success", "Stock deleted successfully!", "success");
        await loadInventory();
        await loadLowStock();
      }
    } catch (error) {
      console.error("Error:", error);
      handleShowToast("Error", error.message, "danger");
    } finally {
      setShowSpinner(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setStockForm({
      id: "",
      productName: "",
      sellingPrice: "",
      openingStock: "",
      newStock: "",
      closeStock: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "newStock") {
      setFormErrors({ ...formErrors, newStock: value === "" });
      if (value === "") {
        setStockForm({
          ...stockForm,
          newStock: value,
          closeStock: stockForm.openingStock,
        });
      } else {
        setStockForm({
          ...stockForm,
          newStock: value,
          closeStock: parseInt(stockForm.openingStock) + parseInt(value),
        });
      }
    }
  };

  const handleConfirmAction = async () => {
    if (actionType === "delete") {
      await handleDeleteProduct(stockForm.id);
    }
    if (actionType === "update") {
      await handleStockUpdate();
    }
    setShowConfirm(false);
  };

  const handleModalShow = (product) => {
    const { id, productName, sellingPrice, quantity } = product;
    setStockForm({
      id,
      productName,
      sellingPrice,
      openingStock: quantity,
      newStock: "",
      closeStock: quantity,
    });
    setShowModal(true);
  };

  return (
    <div className='container'>
      <h2 className='d-flex justify-content-center'>Inventory</h2>

      {lowStockAlert.length > 0 && (
        <Card className='mb-4'>
          <Card.Header
            className='alert alert-warning text-dark'
            onClick={handleToggleProducts}
            style={{ cursor: "pointer" }}
          >
            <HiMiniBellAlert className='me-2' />
            <strong>Low Stock Alert for {lowStockAlert.length} product.</strong>
          </Card.Header>
          {showProducts && (
            <ListGroup variant='flush'>
              {lowStockAlert.map((item) => (
                <ListGroupItem key={item.id}>{item.productName}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </Card>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th className='text-center'>Product Name</th>
            <th className='text-center'>Selling Price</th>
            <th className='text-center'>Stock</th>
            <th className='text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {showSpinner ? (
            <tr>
              <td colSpan='4'>
                <div className='d-flex justify-content-center align-items-center'>
                  <Spinner animation='grow' />
                  <p className='mt-1 ms-2'>Loading...</p>
                </div>
              </td>
            </tr>
          ) : (
            currentInventory.map((item) => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td className='text-end'>
                  {Number(item.sellingPrice).toFixed(2)}
                </td>
                <td className='text-center'>{item.quantity}</td>
                <td className='text-center'>
                  <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Update Stock</Tooltip>}
                  >
                    <Button
                      variant='outline-secondary'
                      onClick={() => handleModalShow(item)}
                      className='mx-2'
                    >
                      <FaEdit />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Delete Stock</Tooltip>}
                  >
                    <Button
                      variant='outline-danger'
                      onClick={() => handleShowConfirm("delete", item.id)}
                    >
                      <RiDeleteBin5Line />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <Pagination className='justify-content-center'>
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
      <Modal
        className='d-flex align-items-center'
        show={showModal}
        onHide={handleModalClose}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Stock for {stockForm.productName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Group className='mb-3'>
                  <Form.Label>Opening Stock</Form.Label>
                  <Form.Control
                    type='number'
                    name='openingStock'
                    value={stockForm.openingStock}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className='mb-3'>
                  <Form.Label>Quantity To Adjust</Form.Label>
                  <Form.Control
                    type='number'
                    name='newStock'
                    value={stockForm.newStock}
                    onChange={handleInputChange}
                    placeholder='Enter quantity to adjust'
                  />
                  <Form.Control.Feedback type='invalid'>
                    Quantity is required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className='mb-3'>
                  <Form.Label>Close Stock</Form.Label>
                  <Form.Control
                    type='number'
                    name='closeStock'
                    value={stockForm.closeStock}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant='primary' onClick={handleStockUpdate}>
            Update Stock
          </Button>
        </Modal.Footer>
      </Modal>
      <ConfirmAction
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={handleConfirmAction}
        title='Are you sure?'
        message={
          actionType === "delete"
            ? "This will permanently delete the stock."
            : "This will update the stock."
        }
        confirmLabel={actionType === "delete" ? "Delete" : "Yes, Update"}
        confirmVariant={actionType === "delete" ? "danger" : "primary"}
      />
    </div>
  );
};

export default Inventory;
