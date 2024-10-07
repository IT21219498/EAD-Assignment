import { useCallback, useContext, useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Modal,
  Row,
  Col,
  Spinner,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaEdit, FaPlus } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  deleteOrder,
  fetchCustomers,
  fetchMaxInvoice,
  fetchOrders,
  fetchProducts,
  saveOrder,
  updateOrder,
} from "../apis/orders";
import Toast from "../components/Toast";
import ConfirmAction from "../components/ConfirmAction";
import AuthContext from "../contexts/AuthContext";

const OrderManagement = () => {
  const { user, setUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const itemsPerPage = 5; // Number of products to show per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [actionType, setActionType] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const deaultOrderItem = {
    product: {
      name: "",
      id: "",
    },
    quantity: 0,
  };
  const defaultOrder = {
    invoiceNo: "",
    customer: {
      name: "",
      email: "",
      id: "",
    },
    orderDate: "",
    status: "",
    orderItems: [deaultOrderItem],
  };

  const [newOrder, setNewOrder] = useState(defaultOrder);

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
          return;
        }
        if (data.data.length === 0) {
          if (!showModal)
            handleToastShow("No orders found", "warning", "Warning");
          setOrders([]);

          return;
        }
        setOrders(data.data);
      } catch (err) {
        setOrders([]);
        console.error(err.message);
        handleToastShow("Error loading orders", "danger");
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
        setProducts([]);

        return;
      }
      if (data.data.length === 0) {
        if (!showModal)
          handleToastShow("No outlets found", "warning", "Warning");
        setProducts([]);

        return;
      }
      setProducts(data.data);
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
  const handleInputOrderItem = (e, index) => {
    const { name, value } = e.target;
    const list = [...newOrder.orderItems];
    list[index][name] = value;
    setNewOrder({ ...newOrder, orderItems: list });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingOrder(null);
    setNewOrder(defaultOrder);
  };

  const handleModalShow = (order = null) => {
    if (order) {
      setEditingOrder(order);
      if (!order.orderItems.length) {
        order.orderItems = [deaultOrderItem];
      }
      setNewOrder(order);
    } else {
      setNewOrder({ ...defaultOrder, invoiceNo: loadInvoiceNo() });
    }
    setShowModal(true);
  };

  const validateOrder = () => {
    if (!newOrder.customer.id) {
      handleToastShow("Please select a customer", "danger");
      return false;
    }
    if (!newOrder.orderDate) {
      handleToastShow("Please select an order date", "danger");
      return false;
    }
    if (!newOrder.status) {
      handleToastShow("Please select a status", "danger");
      return false;
    }
    if (newOrder.orderItems.length === 0) {
      handleToastShow("Please add products to the order", "danger");
      return false;
    }
    for (let i = 0; i < newOrder.orderItems.length; i++) {
      if (!newOrder.orderItems[i].product.id) {
        handleToastShow("Please select a product", "danger");
        return false;
      }
      if (newOrder.orderItems[i].quantity <= 0) {
        handleToastShow("Quantity should be greater than 0", "danger");
        return false;
      }
    }
    return true;
  };

  const handleSaveOrder = async () => {
    if (!validateOrder()) {
      return;
    }
    try {
      let response;
      if (editingOrder) {
        response = await updateOrder(newOrder);
      } else {
        response = await saveOrder(newOrder);
      }
      if (response.status === "NOK") {
        handleToastShow(response.message, "danger");
        handleModalClose();
      }
      handleToastShow(response.message, "success");
      loadOrders();
      handleModalClose();
      return;
    } catch (error) {
      console.error(error);
      handleToastShow("Error saving order", "danger");
    }
  };

  // const handleDeleteProduct = (id) => {
  //   setOrders(orders.filter((product) => product.id !== id));
  // };

  // const toggleProductStatus = (id) => {
  //   setOrders(
  //     orders.map((product) =>
  //       product.id === id ? { ...product, active: !product.active } : product
  //     )
  //   );
  // };

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

  // const handleShowConfirm = (type, id) => {
  //   setActionType(type);
  //   setSelectedOrderId(id);
  //   setShowConfirm(true);
  // };

  const handleConfirmAction = async () => {
    setShowSpinner(true);
    try {
      if (actionType === "delete") {
        await deleteOrder(selectedOrderId);
      } else if (actionType === "updateStatus") {
        // Uncomment and implement this if needed
        // await toggleProductStatus(
        //   products.find((p) => p.id === selectedOrderId)
        // );
      }
      setShowConfirm(false); // Hide confirmation dialog
      await loadOrders(); // Reload orders
    } catch (error) {
      console.error("Error during action:", error);
    } finally {
      setShowSpinner(false); // Hide spinner after the action is complete
    }
  };
  const handleAddOrderItem = () => {
    setNewOrder((prev) => ({
      ...prev,
      orderItems: [...prev.orderItems, deaultOrderItem],
    }));
  };

  const handleRemoveOrderItem = (e, index) => {
    e.preventDefault();
    const list = [...newOrder.orderItems];
    list.splice(index, 1);
    setNewOrder({ ...newOrder, orderItems: list });
  };

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
      <ConfirmAction
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={handleConfirmAction}
        title="Are you sure?"
        message={
          actionType === "delete"
            ? "This will permanently delete the order."
            : "This will change the product's status."
        }
        confirmLabel={actionType === "delete" ? "Delete" : "Yes, Update"}
        confirmVariant={actionType === "delete" ? "danger" : "primary"}
      />

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

          <tbody>
            {showSpinner && (
              <tr>
                <td colSpan="5">
                  <div className="d-flex justify-content-center align-items-center">
                    <Spinner animation="grow" />
                    <p className="mt-1 ml-2">Please Wait...</p>
                  </div>
                </td>
              </tr>
            )}
            {!showSpinner && currentOrders && currentOrders.length !== 0 && (
              <>
                {currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.invoiceNo}</td>
                    <td>{order.customer.email}</td>
                    <td>{order.orderDate}</td>
                    <td>{order.status}</td>
                    <td className="text-center">
                      {order.status !== "Delivered" &&
                        order.status !== "Partially Delivered" &&
                        order.status !== "Cancelled" && (
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Edit Order</Tooltip>}
                          >
                            <Button
                              variant="outline-secondary"
                              onClick={() => handleModalShow(order)}
                              className="mx-2"
                            >
                              <FaEdit />
                            </Button>
                          </OverlayTrigger>
                        )}

                      {/* <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete Order</Tooltip>}
                      >
                        <Button
                          variant="outline-danger"
                          onClick={() => handleShowConfirm("delete", order.id)}
                        >
                          <RiDeleteBin5Line />
                        </Button>
                      </OverlayTrigger> */}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </Table>
        <Pagination className="justify-content-center">
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

        {/* Modal for Add/Edit Product */}
        <Modal show={showModal} onHide={handleModalClose} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingOrder ? "Edit Order" : "Add New Order"}
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
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Label>Customer</Form.Label>
                  <Form.Select
                    name="customer"
                    value={newOrder.customer.id || ""}
                    onChange={(e) => {
                      let selectedCustomer = customers.find(
                        (customer) => customer.id === e.target.value
                      );
                      if (!selectedCustomer) {
                        selectedCustomer = { id: "", name: "Select Customer" };
                      }
                      handleInputChange({
                        target: {
                          name: "customer",
                          value: selectedCustomer,
                        },
                      });
                    }}
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
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
                      <option value="Processing">Processing</option>
                      <option value="Partially Delivered">
                        Partially Delivered
                      </option>
                      <option value="Delivered">Delivered</option>
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
                  {newOrder.orderItems.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Select
                          key={index}
                          name="product"
                          value={product?.product?.id || ""}
                          onChange={(e) => {
                            let selectedProduct = products.find(
                              (product) => product.id === e.target.value
                            );
                            if (!selectedProduct) {
                              selectedProduct = {
                                id: "",
                                name: "Select Product",
                              };
                            }

                            handleInputOrderItem(
                              {
                                target: {
                                  name: "product",
                                  value: selectedProduct,
                                },
                              },
                              index
                            );
                          }}
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="quantity"
                          value={product.quantity}
                          onChange={(e) => handleInputOrderItem(e, index)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="price"
                          value={product?.product?.price || 0}
                          disabled={true}
                        />
                      </td>

                      <td>{product.quantity * product?.product?.price || 0}</td>
                      <td>
                        {index === newOrder.orderItems.length - 1 && (
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Add Product</Tooltip>}
                          >
                            <Button
                              variant="outline-secondary"
                              onClick={() => handleAddOrderItem(product)}
                              className="mx-2"
                            >
                              <FaPlus />
                            </Button>
                          </OverlayTrigger>
                        )}
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Delete Product</Tooltip>}
                        >
                          <Button
                            variant="outline-secondary"
                            onClick={(e) => handleRemoveOrderItem(e, index)}
                            className="mx-2"
                          >
                            <RiDeleteBin5Line />
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveOrder}>
              {editingOrder ? "Update Order" : "Add Order"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default OrderManagement;
