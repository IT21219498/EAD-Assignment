import { useCallback, useEffect, useState } from "react";
import { Table, Form, Button, Modal, Row, Col, Spinner } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  fetchCustomers,
  fetchMaxInvoice,
  fetchOrders,
  fetchProducts,
} from "../apis/orders";
import Toast from "../components/Toast";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const deaultOrderItem = {
    name: "",
    quantity: 0,
    price: 0,
  };

  const [newOrder, setNewOrder] = useState({
    invoiceNo: fetchMaxInvoice(),
    customer: "",
    orderDate: "",
    status: "",
    products: [deaultOrderItem],
  });

  const defaultPaginationDetails = {
    page: 1,
    pageSize: 5,
    totalPages: 1,
    totalItems: 0,
  };

  const [orderPaginationData, setOrderPaginationData] = useState(
    defaultPaginationDetails
  );

  const loadOrders = useCallback(
    async (search, page = 1, pageSize = 5, searchcolumn) => {
      if (!search) {
        search = "";
      }
      // setShowSpinner(true);
      try {
        console.log("🚀 ~ pageSize:", pageSize);
        const data = await fetchOrders(search, searchcolumn, page, pageSize);
        if (data.status === "NOK") {
          if (!showModal) handleToastShow(data.message, "danger");
          setOrders([]);
          setOrderPaginationData(defaultPaginationDetails);

          return;
        }
        if (data.data.length === 0) {
          if (!showModal)
            handleToastShow("No outlets found", "warning", "Warning");
          setOrders([]);

          return;
        }
        setOrders(data.data);
        // setOrderPaginationData({
        //   page: data.page,
        //   pageSize: data.page_size,
        //   totalPages: data.total_pages,
        //   totalItems: data.total_customers,
        // });
      } catch (err) {
        setOrders([]);
        console.error(err.message);
        handleToastShow("Error loading outlets", "danger");
      }
    },
    []
  );
  const loadInvoiceNo = useCallback(async () => {
    try {
      const data = await fetchMaxInvoice();
      if (data.status === "NOK") {
        if (!showModal) handleToastShow(data.message, "danger");
        setNewOrder((prev) => ({ ...prev, invoiceNo: "" }));

        return;
      }
      setNewOrder((prev) => ({ ...prev, invoiceNo: data.data }));
    } catch (err) {
      setOrders([]);
      console.error(err.message);
      handleToastShow("Error loading outlets", "danger");
    }
  }, []);
  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchProducts();
      if (data.status === "NOK") {
        if (!showModal) handleToastShow(data.message, "danger");
        setNewOrder((prev) => ({ ...prev, invoiceNo: "" }));

        return;
      }
      setNewOrder((prev) => ({ ...prev, invoiceNo: data.data }));
    } catch (err) {
      setOrders([]);
      console.error(err.message);
      handleToastShow("Error loading outlets", "danger");
    }
  }, []);

  const loadCustomers = useCallback(async () => {
    try {
      const data = await fetchCustomers();
      if (data.status === "NOK") {
        if (!showModal) handleToastShow(data.message, "danger");
        setCustomers([]);

        return;
      }
      if (data.data.length === 0) {
        if (!showModal)
          handleToastShow("No outlets found", "warning", "Warning");
        setCustomers([]);

        return;
      }
      setCustomers(data.data);
    } catch (err) {
      setCustomers([]);
      console.error(err.message);
      handleToastShow("Error loading outlets", "danger");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingOrder(null);
    setNewOrder({ name: "", category: "", price: 0, active: false });
  };

  const handleModalShow = (product = null) => {
    setNewOrder({
      ...newOrder,
      invoiceNo: loadInvoiceNo(),
    });
    if (product) {
      setEditingOrder(product);
      setNewOrder(product);
    }
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    if (editingOrder) {
      setOrders(
        orders.map((product) =>
          product.id === editingOrder.id ? newOrder : product
        )
      );
    } else {
      setOrders([
        ...orders,
        { ...newOrder, id: orders.length + 1, active: false },
      ]);
    }
    handleModalClose();
  };

  const handleDeleteProduct = (id) => {
    setOrders(orders.filter((product) => product.id !== id));
  };

  const toggleProductStatus = (id) => {
    setOrders(
      orders.map((product) =>
        product.id === id ? { ...product, active: !product.active } : product
      )
    );
  };
  const handleToastShow = (message, variant) => {
    setShowToast(true);
    setToastVariant(variant);
    setToastMessage(message);
  };

  const handleToastClose = () => {
    setShowToast(false);
    setToastVariant(null);
    setToastMessage(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setShowSpinner(true);
      await Promise.all([
        loadOrders(),
        loadCustomers(),
        loadInvoiceNo(),
        loadProducts(),
      ]);
      setShowSpinner(false);
    };

    fetchData();
  }, [loadOrders, loadCustomers, loadInvoiceNo, loadProducts]);

  return (
    <>
      {showToast && (
        <Toast
          title={toastVariant}
          variant={toastVariant}
          message={toastMessage}
          showToast={showToast}
          handleClose={handleToastClose}
        />
      )}

      <div className="container ">
        <h2 className="d-flex justify-content-center">Orders</h2>
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => handleModalShow()}
        >
          New Order
        </Button>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Customer Email</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          {showSpinner && (
            <div className="d-flex flex-column justify-content-center align-items-center mt-5">
              <Spinner animation="grow" />
              <p className="mt-1">Please Wait...</p>
            </div>
          )}
          {!showSpinner && orders && orders.length != 0 && (
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.invoiceNo}</td>
                  <td>{order.email}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.status}</td>
                  {/* <td>{order.isActive ? "Active" : "Inactive"}</td>
              <td>
                <Button
                  variant={order.active ? "danger" : "success"}
                  onClick={() => toggleProductStatus(order.id)}
                  className="me-2"
                >
                  {order.active ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleModalShow(order)}
                  className="mx-2"
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteProduct(order.id)}
                >
                  <RiDeleteBin5Line />
                </Button>
              </td> */}
                </tr>
              ))}
            </tbody>
          )}
        </Table>

        {/* Modal for Add/Edit Product */}
        <Modal show={showModal} onHide={handleModalClose} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingOrder ? "Edit Product" : "Add New Order"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>InvoiceNo</Form.Label>
                    <Form.Control
                      type="text"
                      name="invoiceNo"
                      value={newOrder.invoiceNo}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Label>Customer</Form.Label>
                  <Form.Select
                    name="customer"
                    value={newOrder.customer}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Customer</option>
                    {customers.map((category) => (
                      <option
                        key={category.id.timestamp}
                        value={category.id.timestamp}
                      >
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Order Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="orderDate"
                      value={newOrder.orderDate}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={newOrder.status}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Partially Delivered">
                        Partially Delivered
                      </option>
                      <option value="Cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newOrder.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.price}</td>
                      <td>{product.price * product.quantity}</td>
                      <td>
                        <Button variant="danger">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="primary" onClick={() => handleModalShow()}>
                Add Product
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveProduct}>
              {editingOrder ? "Update Product" : "Add Product"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default OrderManagement;
