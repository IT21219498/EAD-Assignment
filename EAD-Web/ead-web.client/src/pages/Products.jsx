import { useContext, useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Modal,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import {
  fetchProducts,
  fetchCategories,
  fetchUOMs,
  saveProduct,
  getSelectedProduct,
  deleteProduct,
  updateProduct,
  updateProductStatus,
} from "../apis/products";
import ToastContext from "../contexts/ToastContext";
import ConfirmAction from "../components/ConfirmAction";
import { Pagination } from "react-bootstrap";

const Products = () => {
  const [products, setProducts] = useState([]);
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
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    code: "",
    category: "",
    uom: "",
    itemPerCase: "",
    price: "",
    cost: "",
    reorderLevel: "",
    image: "",
  });
  const {
    setShowToast,
    setToastTitle,
    setToastVariant,
    setToastMessage,
    setToastPosition,
  } = useContext(ToastContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of products to show per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  useEffect(() => {
    Promise.all([loadProducts(), loadCategories(), loadUOMs()]);
  }, []);

  const handleShowToast = (title, message, variant) => {
    setShowToast(true);
    setToastTitle(title);
    setToastMessage(message);
    setToastVariant(variant);
    setToastPosition("top-end");
  };

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      handleShowToast("Error", error.message, "danger");
      console.error("Error:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      handleShowToast("Error", error.message, "danger");
      console.error("Error:", error);
    }
  };

  const loadUOMs = async () => {
    try {
      const data = await fetchUOMs();
      setUoms(data);
    } catch (error) {
      handleShowToast("Error", error.message, "danger");
      console.error("Error:", error);
    }
  };

  const loadSelectedProduct = async (id) => {
    try {
      const data = await getSelectedProduct(id);
      const product = {
        id: data.id,
        name: data.name,
        description: data.description,
        code: data.code,
        category: data.categoryId,
        uom: data.measurementUnitId,
        itemPerCase: data.itemPerCase,
        price: data.price,
        cost: data.cost,
        reorderLevel: data.reorderLevel,
        active: data.isActive,
        image: data.image,
      };
      setNewProduct(product);
    } catch (error) {
      handleShowToast("Error", error.message, "danger");
      console.error("Error:", error);
    }
  };

  const handleShowConfirm = (type, id) => {
    setActionType(type);
    setSelectedProductId(id);
    setShowConfirm(true);
  };

  const handleConfirmAction = async () => {
    if (actionType === "delete") {
      await handleDeleteProduct(selectedProductId);
    } else if (actionType === "updateStatus") {
      await toggleProductStatus(
        products.find((p) => p.id === selectedProductId)
      );
    }
    setShowConfirm(false);
  };

  const handleInputChange = (e) => {
    setFormErrors({ ...formErrors, [e.target.name]: "" });
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleModalClose = () => {
    handleReset();
    setShowModal(false);
    setEditingProduct(null);
    setNewProduct({ name: "", category: "", price: 0, active: false });
  };

  const handleModalShow = (product = null) => {
    if (product) {
      loadSelectedProduct(product.id);
    }
    setShowModal(true);
    setEditingProduct(product);
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!newProduct.name) {
      errors.name = "Product name is required";
      isValid = false;
    }

    if (!newProduct.category) {
      errors.category = "Category is required";
      isValid = false;
    }

    if (!newProduct.uom) {
      errors.uom = "Unit of measure is required";
      isValid = false;
    }

    if (!newProduct.price) {
      errors.price = "Price is required";
      isValid = false;
    }

    if (!newProduct.cost) {
      errors.cost = "Cost is required";
      isValid = false;
    }

    if (!newProduct.itemPerCase) {
      errors.itemPerCase = "Item per case is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSaveProduct = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      if (editingProduct) {
        handleUpdateProduct();
      } else {
        const data = {
          Name: newProduct.name,
          Description: newProduct.description,
          Code: newProduct.code,
          CategoryId: newProduct.category,
          MeasurementUnitId: newProduct.uom,
          ItemPerCase: newProduct.itemPerCase,
          Price: newProduct.price,
          Cost: newProduct.cost,
          ReorderLevel: newProduct.reorderLevel,
          IsActive: newProduct.active,
          Image: newProduct.image,
          SupplierId: "66fc3606342696db9557e652",
        };

        const result = await saveProduct(data);
        if (result.error) {
          handleShowToast("Error", result.error, "danger");
          console.error("Error:", result.error);
          return;
        } else {
          handleShowToast("Success", "Product added successfully", "success");
          // handleModalClose();
          loadProducts();
        }
      }
    } catch (error) {
      handleShowToast("Error", error.message, "danger");
      console.error("Error:", error);
    }
  };

  const handleUpdateProduct = async () => {
    if (editingProduct === null) {
      handleShowToast("Error", "Product not found", "danger");
      return;
    }
    try {
      const data = {
        Id: editingProduct.id,
        Name: newProduct.name,
        Description: newProduct.description,
        Code: newProduct.code,
        CategoryId: newProduct.category,
        MeasurementUnitId: newProduct.uom,
        ItemPerCase: newProduct.itemPerCase,
        Price: newProduct.price,
        Cost: newProduct.cost,
        ReorderLevel: newProduct.reorderLevel,
        IsActive: newProduct.active,
        Image: newProduct.image,
        SupplierId: "66fc3606342696db9557e652",
      };

      const result = await updateProduct(data);
      if (result.error) {
        handleShowToast("Error", result.error, "danger");
        console.error("Error:", result.error);
        return;
      } else {
        handleShowToast("Success", "Product updated successfully", "success");
        handleModalClose();
        await loadProducts();
      }
    } catch (error) {
      handleShowToast("Error", error.message, "danger");
      console.error("Error:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (id === null) {
      handleShowToast("Error", "Product not found", "danger");
      return;
    }
    try {
      const result = await deleteProduct(id);
      console.log("🚀 ~ handleDeleteProduct ~ result:", result);
      if (result.error) {
        handleShowToast("Error", result.error, "danger");
        console.error("Error:", result.error);
        return;
      } else {
        handleShowToast("Success", "Product deleted successfully", "success");
        await loadProducts();
      }
    } catch (error) {
      handleShowToast("Error", error.message, "danger");
      console.error("Error:", error);
    }
  };

  const toggleProductStatus = async (product) => {
    if (product.id === null) {
      handleShowToast("Error", "Product not found", "danger");
      return;
    }
    try {
      const result = await updateProductStatus(product.id, !product.isActive);
      if (result.error) {
        handleShowToast("Error", result.error, "danger");
        console.error("Error:", result.error);
        return;
      } else {
        handleShowToast("Success", "Product status updated", "success");
        await loadProducts();
      }
    } catch (error) {
      handleShowToast("Error", error.message, "danger");
      console.error("Error:", error);
    }
  };

  const handleReset = () => {
    setNewProduct({
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

    setFormErrors({
      name: "",
      description: "",
      code: "",
      category: "",
      uom: "",
      itemPerCase: "",
      price: "",
      cost: "",
      reorderLevel: "",
      image: "",
    });

    setEditingProduct(null);
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
            <th className='text-center'>Product Name</th>
            <th className='text-center'>Description</th>
            <th className='text-center'>Code</th>
            <th className='text-center'>Category</th>
            <th className='text-center'>UOM</th>
            <th className='text-center'>Item per Case</th>
            <th className='text-center'>Cost</th>
            <th className='text-center'>Price</th>
            <th className='text-center'>Status</th>
            <th className='text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.code}</td>
              <td>{product.categoryName}</td>
              <td>{product.measurementUnitName}</td>
              <td className='text-end'>{product.itemPerCase}</td>
              <td className='text-end'>{Number(product.cost).toFixed(2)}</td>
              <td className='text-end'>{Number(product.price).toFixed(2)}</td>
              <td className='text-center'>
                {product.isActive ? "Active" : "Inactive"}
              </td>
              <td className='text-center'>
                <OverlayTrigger
                  placement='top'
                  overlay={
                    <Tooltip>
                      {product.isActive
                        ? "Deactivate Product"
                        : "Activate Product"}
                    </Tooltip>
                  }
                >
                  <Button
                    variant={
                      product.isActive ? "outline-danger" : "outline-success"
                    }
                    onClick={() =>
                      handleShowConfirm("updateStatus", product.id)
                    }
                    className='me-2'
                  >
                    {product.isActive ? <AiOutlineClose /> : <AiOutlineCheck />}
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement='top'
                  overlay={<Tooltip>Edit Product</Tooltip>}
                >
                  <Button
                    variant='outline-secondary'
                    onClick={() => handleModalShow(product)}
                    className='mx-2'
                  >
                    <FaEdit />
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement='top'
                  overlay={<Tooltip>Delete Product</Tooltip>}
                >
                  <Button
                    variant='outline-danger'
                    onClick={() => handleShowConfirm("delete", product.id)}
                  >
                    <RiDeleteBin5Line />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
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
                    isInvalid={formErrors.name}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.name}
                  </Form.Control.Feedback>
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
                    isInvalid={formErrors.description}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.description}
                  </Form.Control.Feedback>
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
                    isInvalid={formErrors.code}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.code}
                  </Form.Control.Feedback>
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
                    isInvalid={formErrors.active}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.active}
                  </Form.Control.Feedback>
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
                    isInvalid={formErrors.category}
                  >
                    <option value=''>Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>Unit of Measure</Form.Label>
                  <Form.Select
                    name='uom'
                    value={newProduct.uom}
                    onChange={handleInputChange}
                    isInvalid={formErrors.uom}
                  >
                    <option value=''>Select UOM</option>
                    {uoms.map((uom) => (
                      <option key={uom.id} value={uom.id}>
                        {uom.unit}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.uom}
                  </Form.Control.Feedback>
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
                    isInvalid={formErrors.itemPerCase}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.itemPerCase}
                  </Form.Control.Feedback>
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
                    isInvalid={formErrors.price}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.price}
                  </Form.Control.Feedback>
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
                    isInvalid={formErrors.cost}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.cost}
                  </Form.Control.Feedback>
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
                    isInvalid={formErrors.reorderLevel}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.reorderLevel}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type='file'
                    name='image'
                    value={newProduct.image}
                    onChange={handleInputChange}
                    isInvalid={formErrors.image}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {formErrors.image}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant='danger' onClick={handleReset}>
            Reset
          </Button>
          <Button variant='primary' onClick={handleSaveProduct}>
            {editingProduct ? "Update Product" : "Add Product"}
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
            ? "This will permanently delete the product."
            : "This will change the product's status."
        }
        confirmLabel={actionType === "delete" ? "Delete" : "Yes, Update"}
        confirmVariant={actionType === "delete" ? "danger" : "primary"}
      />
    </div>
  );
};

export default Products;
