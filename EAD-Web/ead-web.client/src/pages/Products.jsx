import { useState } from "react";
import { Table, Form, Button, Modal, Row, Col } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      category: "Category 1",
      price: 100,
      active: false,
    },
    {
      id: 2,
      name: "Product 2",
      category: "Category 2",
      price: 150,
      active: false,
    },
  ]);

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
  });

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
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? newProduct : product
        )
      );
    } else {
      setProducts([
        ...products,
        { ...newProduct, id: products.length + 1, active: false },
      ]);
    }
    handleModalClose();
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const toggleProductStatus = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, active: !product.active } : product
      )
    );
  };

  return (
    <div className='container '>
      <h2 className='d-flex justify-content-center'>Products</h2>
      <Button
        variant='primary'
        className='mb-3'
        onClick={() => handleModalShow()}
      >
        New Product
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{product.active ? "Active" : "Inactive"}</td>
              <td>
                <Button
                  variant={product.active ? "danger" : "success"}
                  onClick={() => toggleProductStatus(product.id)}
                  className='me-2'
                >
                  {product.active ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant='secondary'
                  onClick={() => handleModalShow(product)}
                  className='mx-2'
                >
                  <FaEdit />
                </Button>
                <Button
                  variant='danger'
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <RiDeleteBin5Line />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit Product */}
      <Modal show={showModal} onHide={handleModalClose} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type='text'
                    name='name'
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder='Enter product name'
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className='mb-3'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type='text'
                    name='description'
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder='Enter product description'
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className='mb-3'>
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type='text'
                    name='code'
                    value={newProduct.code}
                    onChange={handleInputChange}
                    placeholder='Enter product code'
                  />
                </Form.Group>
              </Col>
              <Col md={1}>
                <Form.Group className='mb-3'>
                  <Form.Label>Status</Form.Label>
                  <Form.Check
                    type='switch'
                    id='active-switch'
                    name='active'
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
                <Form.Group className='mb-3'>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name='category'
                    value={newProduct.category}
                    onChange={handleInputChange}
                  >
                    <option value=''>Select Category</option>
                    <option value='Category 1'>Category 1</option>
                    <option value='Category 2'>Category 2</option>
                    <option value='Category 3'>Category 3</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>Unit of Measure</Form.Label>
                  <Form.Select
                    name='uom'
                    value={newProduct.uom}
                    onChange={handleInputChange}
                  >
                    <option value=''>Select UOM</option>
                    <option value='Each'>Each</option>
                    <option value='Dozen'>Dozen</option>
                    <option value='Pound'>Pound</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>Item per Case</Form.Label>
                  <Form.Control
                    type='number'
                    name='itemPerCase'
                    value={newProduct.itemPerCase}
                    onChange={handleInputChange}
                    placeholder='Enter item per case'
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type='number'
                    name='price'
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder='Enter product price'
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>Cost</Form.Label>
                  <Form.Control
                    type='number'
                    name='cost'
                    value={newProduct.cost}
                    onChange={handleInputChange}
                    placeholder='Enter product cost'
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>Reorder Level</Form.Label>
                  <Form.Control
                    type='number'
                    name='reorderLevel'
                    value={newProduct.reorderLevel}
                    onChange={handleInputChange}
                    placeholder='Enter reorder level'
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
          <Button variant='primary' onClick={handleSaveProduct}>
            {editingProduct ? "Update Product" : "Add Product"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
