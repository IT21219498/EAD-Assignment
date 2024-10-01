import { useEffect, useState } from "react";
import { Table, Form, Button, Modal, Row, Col } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { fetchOrders } from "../apis/orders";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newOrder, setNewOrder] = useState({
    name: "",
    description: "",
    code: "",
    category: "",
    uom: "",
    itemPerCase: 0,
    price: 0,
    cost: 0,
    reorderLevel: 0,
    active: false,
    image: "",
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
    setNewOrder({ name: "", category: "", price: 0, active: false });
  };

  const handleModalShow = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setNewOrder(product);
    }
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      setOrders(
        orders.map((product) =>
          product.id === editingProduct.id ? newOrder : product
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

  return (
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
      </Table>

      {/* Modal for Add/Edit Product */}
      <Modal show={showModal} onHide={handleModalClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>InvoiceNo</Form.Label>
                  <Form.Control
                    type="text"
                    name="invoiceNo"
                    value={newOrder.invoiceNo}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={newOrder.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={newOrder.code}
                    onChange={handleInputChange}
                    placeholder="Enter product code"
                  />
                </Form.Group>
              </Col>
              <Col md={1}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Check
                    type="switch"
                    id="active-switch"
                    name="active"
                    checked={newOrder.active}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, active: e.target.checked })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={newOrder.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    {/* {categories.map((category) => (
                      <option
                        key={category.id.timestamp}
                        value={category.id.timestamp}
                      >
                        {category.name}
                      </option>
                    ))} */}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit of Measure</Form.Label>
                  <Form.Select
                    name="uom"
                    value={newOrder.uom}
                    onChange={handleInputChange}
                  >
                    <option value="">Select UOM</option>
                    {/* {uoms.map((uom) => (
                      <option key={uom.id.timestamp} value={uom.id.timestamp}>
                        {uom.unit}
                      </option>
                    ))} */}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Item per Case</Form.Label>
                  <Form.Control
                    type="number"
                    name="itemPerCase"
                    value={newOrder.itemPerCase}
                    onChange={handleInputChange}
                    placeholder="Enter item per case"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={newOrder.price}
                    onChange={handleInputChange}
                    placeholder="Enter product price"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cost</Form.Label>
                  <Form.Control
                    type="number"
                    name="cost"
                    value={newOrder.cost}
                    onChange={handleInputChange}
                    placeholder="Enter product cost"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Reorder Level</Form.Label>
                  <Form.Control
                    type="number"
                    name="reorderLevel"
                    value={newOrder.reorderLevel}
                    onChange={handleInputChange}
                    placeholder="Enter reorder level"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    value={newOrder.image}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            {editingProduct ? "Update Product" : "Add Product"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagement;
