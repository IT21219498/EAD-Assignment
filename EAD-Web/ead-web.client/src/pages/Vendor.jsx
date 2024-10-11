import { Table, Form, Button, Modal, Row, Col, OverlayTrigger, Tooltip, Pagination } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { fetchVendors, saveVendor, getSelectedVendor, updateVendor, deleteVendor } from "../apis/vendor";
import { fetchCategories } from "../apis/products";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import ToastContext from "../contexts/ToastContext";
import ConfirmAction from "../components/ConfirmAction";

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [newVendor, setNewVendor] = useState({
    vendorName: "",
    address: "",
    contactName: "",
    contactNo: "",
    email: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedVendorName, setSelectedVendorName] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVendors = vendors.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(vendors.length / itemsPerPage);
  const {
    setShowToast,
    setToastTitle,
    setToastVariant,
    setToastMessage,
    setToastPosition,
  } = useContext(ToastContext);

  const [formErrors, setFormErrors] = useState({
    vandorName: "",
    address: "",
    contactName: "",
    contactNo: "",
    email: "",
    category: "",
  });

  useEffect(() => {
    Promise.all([loadVendors(), loadCategories()]);
  }, []);

  const handleShowToast = (title, message, variant) => {
    setShowToast(true);
    setToastTitle(title);
    setToastMessage(message);
    setToastVariant(variant);
    setToastPosition("top-end");
  };

  const loadVendors = async () => {
    try {
      const data = await fetchVendors();
      setVendors(data);
    } catch (error) {
      handleShowToast("Error", error.message, "danger");
      console.error(error);
    }
  };

  const loadSelectedVendor = async (vendorName) => {
      try {
          const data = await getSelectedVendor(vendorName);
          const vendor = {
              vendorName: data.vendorName,
              address: data.address,
              contactName: data.contactName,
              contactNo: data.contactNo,
              email: data.email,
              category: data.category
          }
          setNewVendor(vendor);
      }
      catch (error) {
          handleShowToast("Error", error.message, "danger");
          console.error(error);
      }
  }

  const handleShowConfirm = (type, name) => {
    setActionType(type);
    setSelectedVendorName(name);
    setShowConfirm(true);
  };

  const handleConfirmAction = async () => {
    if (actionType === "delete") {
      await deleteVendor(selectedVendorName);
    }
    setShowConfirm(false);
    loadVendors();
  };

  const handleModalClose = () => {
    handleReset();
    setShowModal(false);
    setEditingVendor(null);
    setNewVendor({
      vendorName: "",
      address: "",
      contactName: "",
      contactNo: "",
      email: "",
      category: "",
    });
  };

  const handleModalShow = (vendor = null) => {
    if (vendor) {
        loadSelectedVendor(vendor.vendorName);
    }
    setShowModal(true);
    setEditingVendor(vendor);
  };

  const handleReset = () => {
    setNewVendor({
      vendorName: "",
      address: "",
      contactName: "",
      contactNo: "",
      email: "",
      category: "",
    });

    setEditingVendor(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVendor({ ...newVendor, [name]: value });
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

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!newVendor.vendorName) {
      errors.vendorName = "Vendor name is required";
      isValid = false;
    }
    if (!newVendor.address) {
      errors.address = "Address is required";
      isValid = false;
      }
    if (!newVendor.contactName) {
      errors.contactName = "Contact Person name is required";
      isValid = false;
    }
    if (!newVendor.contactNo) {
      errors.contactNo = "Contact number is required";
      isValid = false;
    }
    if (!newVendor.email) {
      errors.email = "Email is required";
      isValid = false;
    }
    if (!newVendor.category) {
      errors.category = "Category is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
    };

  const handleSaveVendor = async () => {
    if (!validateForm()) {
        return;
    }
    try {
      if (editingVendor) {
        handleUpdateVendor();
      } else {
        const data = {
          vendorName: newVendor.vendorName,
          address: newVendor.address,
          contactName: newVendor.contactName,
          contactNo: newVendor.contactNo,
          email: newVendor.email,
          category: newVendor.category,
        };

        const result = await saveVendor(data);
        if (result.error) {
          handleShowToast("Error", result.error, "danger");
          console.error("Error:", result.error);
          return;
        } else {
          handleShowToast("Success", "Product added successfully", "success");
          handleModalClose();
          loadVendors();
        }
      }
    } catch (error) {
      handleShowToast("Error", error.message, "danger");
      console.error("Error:", error);
    }
  };

  const handleUpdateVendor = async () => {
    if (editingVendor === null) {
      handleShowToast("Error", "Vendor not found", "danger");
      return;
    }
    try {
      const data = {
        vendorName: editingVendor.vendorName,
        address: newVendor.address,
        contactName: newVendor.contactName,
        contactNo: newVendor.contactNo,
        email: newVendor.email,
        category: newVendor.category,
      };

      const result = await updateVendor(data);

      if (result.error) {
        handleShowToast("Error", result.error, "danger");
        console.error("Error:", result.error);
        return;
      } else {
        handleShowToast("Success", "Vendor updated successfully", "success");
        handleModalClose();
        await loadVendors();
      }
    } catch (error) {
      handleShowToast("Error", error.message, "danger");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container ">
      <h2 className="d-flex justify-content-center">Vendors</h2>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => handleModalShow()}
      >
        New Vendor
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-center">Vendor Name</th>
            <th className="text-center">Address</th>
            <th className="text-center">Contact Name</th>
            <th className="text-center">Contact No</th>
            <th className="text-center">Email</th>
            <th className="text-center">Category</th>
            <th className='text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentVendors.map((vendor) => (
            <tr key={vendor.vendorName}>
              <td>{vendor.vendorName}</td>
              <td>{vendor.address}</td>
              <td>{vendor.contactName}</td>
              <td>{vendor.contactNo}</td>
              <td>{vendor.email}</td>
              <td>{vendor.category}</td>
                  <td className='text-center'>
                      <OverlayTrigger
                          placement='top'
                          overlay={<Tooltip>Edit Vendor</Tooltip>}
                      >
                          <Button
                              variant='outline-secondary'
                              onClick={() => handleModalShow(vendor)}
                              className='mx-2'
                          >
                              <FaEdit />
                          </Button>
                      </OverlayTrigger>

                      <OverlayTrigger
                          placement='top'
                          overlay={<Tooltip>Delete Vendor</Tooltip>}
                      >
                          <Button
                              variant='outline-danger'
                              onClick={() => handleShowConfirm("delete", vendor.vendorName)}
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

      <Modal show={showModal} onHide={handleModalClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingVendor ? "Edit Vendor" : "Add New Vendor"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Vendor Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="vendorName"
                    value={newVendor.vendorName}
                    onChange={handleInputChange}
                    placeholder="Enter vendor name"
                    isInvalid={formErrors.vendorName}
                  />
                  <Form.Control.Feedback type='invalid'>
                      {formErrors.vendorName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={newVendor.address}
                    onChange={handleInputChange}
                    placeholder="Enter vendor address"
                    isInvalid={formErrors.address}
                  />
                  <Form.Control.Feedback type='invalid'>
                      {formErrors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Person Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactName"
                    value={newVendor.contactName}
                    onChange={handleInputChange}
                    placeholder="Enter contact person"
                    isInvalid={formErrors.contactName}
                  />
                  <Form.Control.Feedback type='invalid'>
                      {formErrors.contactName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactNo"
                    value={newVendor.contactNo}
                    onChange={handleInputChange}
                    placeholder="Enter contact number"
                    isInvalid={formErrors.contactNo}
                  />
                  <Form.Control.Feedback type='invalid'>
                      {formErrors.contactNo}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={newVendor.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    isInvalid={formErrors.email}
                  />
                  <Form.Control.Feedback type='invalid'>
                      {formErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={newVendor.category}
                    onChange={handleInputChange}
                    isInvalid={formErrors.category}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                      {formErrors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" onClick={handleSaveVendor}>
            {editingVendor ? "Update Vendor" : "Add Vendor"}
          </Button>
        </Modal.Footer>
      </Modal>
      <ConfirmAction
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={handleConfirmAction}
        title='Are you sure?'
        message={"This will permanently delete the vendor."}
        confirmLabel={actionType === "delete" ? "Delete" : "Yes, Update"}
        confirmVariant={actionType === "delete" ? "danger" : "primary"}
      />
    </div>
  );
};

export default Vendor;
