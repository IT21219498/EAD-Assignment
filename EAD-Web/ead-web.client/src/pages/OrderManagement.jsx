import { useEffect, useState } from "react";
import { Table, Form, Button, Modal, Row, Col } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  fetchProducts,
  fetchCategories,
  fetchUOMs,
  fetchOrders,
} from "../apis/orders";
// import DataTable from "../components/DataTable";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
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

  const columns = [
    { title: "Cheque No", field: "ChequeNo" },
    { title: "Cheque Date", field: "ChequeDate" },
    { title: "Deposited Date", field: "DepositedDate" },
    { title: "Amount", field: "Amount", footerValue: true },
    { title: "Bank Account Name", field: "BankAccountName" },
    { title: "Bank Account Branch Name", field: "BankAccountBranchName" },
    { title: "Cheque Bank Account Name", field: "ChequeBankAccountName" },
    {
      title: "Cheque Bank Account Branch Name",
      field: "ChequeBankAccountBranchName",
    },
  ];

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
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
    setNewProduct({ name: "", category: "", price: 0, active: false });
  };

  const handleModalShow = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setNewProduct(product);
    }
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      setOrders(
        orders.map((product) =>
          product.id === editingProduct.id ? newProduct : product
        )
      );
    } else {
      setOrders([
        ...orders,
        { ...newProduct, id: orders.length + 1, active: false },
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
      <h2 className="d-flex justify-content-center">Products</h2>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => handleModalShow()}
      >
        New Order
      </Button>

      {/* <DataTable
        key={JSON.stringify(jsondata)}
        columns={columns}
        dataUrl={`${process.env.REACT_APP_BASE_URL}chequedepositreports/getChequesToDepositReports`}
        jsondata={jsondata}
        options={options}
        printFooter={printFooter}
        printHeader={"Cheque Deposit Report"}
      /> */}

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
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newProduct.name}
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
                    value={newProduct.description}
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
                    value={newProduct.code}
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
                    checked={newProduct.active}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, active: e.target.checked })
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
                    value={newProduct.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option
                        key={category.id.timestamp}
                        value={category.id.timestamp}
                      >
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit of Measure</Form.Label>
                  <Form.Select
                    name="uom"
                    value={newProduct.uom}
                    onChange={handleInputChange}
                  >
                    <option value="">Select UOM</option>
                    {uoms.map((uom) => (
                      <option key={uom.id.timestamp} value={uom.id.timestamp}>
                        {uom.unit}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Item per Case</Form.Label>
                  <Form.Control
                    type="number"
                    name="itemPerCase"
                    value={newProduct.itemPerCase}
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
                    value={newProduct.price}
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
                    value={newProduct.cost}
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
                    value={newProduct.reorderLevel}
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
                    value={newProduct.image}
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
