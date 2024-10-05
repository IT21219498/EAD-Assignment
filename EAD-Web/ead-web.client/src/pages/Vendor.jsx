import { Table, Form, Button, Modal, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { fetchVendors, saveVendor } from "../apis/vendor";
import { fetchCategories } from "../apis/products";

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

  useEffect(() => {
    Promise.all([loadVendors(), loadCategories()]);
  }, []);

  const loadVendors = async () => {
    try {
      const data = await fetchVendors();
      setVendors(data);
    } catch (error) {
      console.error(error);
    }
  };

  //const loadSelectedVendor = async (vendorName) => {
  //    try {
  //        const data = await fetchSelectedVendor(vendorName);
  //        const vendor = {
  //            vendorName: data.vendorName,
  //            address: data.address,
  //            contactName: data.contactName,
  //            contactNo: data.contactNo,
  //            email: data.email,
  //            category: data.category
  //        }

  //        setNewVendor(vendor);
  //    }
  //    catch (error) {
  //        console.error(error);
  //    }
  //}

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
      loadSelectedVendor(vendor.productName);
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
      //handleShowToast("Error", error.message, "danger");
      console.error("Error:", error);
    }
  };

  const handleSaveVendor = async () => {
    //if (!validateForm()) {
    //    return;
    //}
    try {
      if (editingVendor) {
        //handleUpdateProduct();
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
          //handleShowToast("Error", result.error, "danger");
          console.error("Error:", result.error);
          return;
        } else {
          //handleShowToast("Success", "Product added successfully", "success");
          handleModalClose();
          loadVendors();
        }
      }
    } catch (error) {
      //handleShowToast("Error", error.message, "danger");
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
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.vendorName}>
              <td>{vendor.vendorName}</td>
              <td>{vendor.address}</td>
              <td>{vendor.contactName}</td>
              <td>{vendor.contactNo}</td>
              <td>{vendor.email}</td>
              <td>{vendor.category}</td>
            </tr>
          ))}
        </tbody>
      </Table>

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
                    /*isInvalid={formErrors.name}*/
                  />
                  {/*<Form.Control.Feedback type='invalid'>*/}
                  {/*    {formErrors.name}*/}
                  {/*</Form.Control.Feedback>*/}
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
                    /*isInvalid={formErrors.description}*/
                  />
                  {/*<Form.Control.Feedback type='invalid'>*/}
                  {/*    {formErrors.description}*/}
                  {/*</Form.Control.Feedback>*/}
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
                    /*isInvalid={formErrors.code}*/
                  />
                  {/*<Form.Control.Feedback type='invalid'>*/}
                  {/*    {formErrors.code}*/}
                  {/*</Form.Control.Feedback>*/}
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
                    /*isInvalid={formErrors.uom}*/
                  />
                  {/*<Form.Control.Feedback type='invalid'>*/}
                  {/*    {formErrors.uom}*/}
                  {/*</Form.Control.Feedback>*/}
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
                    /*isInvalid={formErrors.itemPerCase}*/
                  />
                  {/*<Form.Control.Feedback type='invalid'>*/}
                  {/*    {formErrors.itemPerCase}*/}
                  {/*</Form.Control.Feedback>*/}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={newVendor.category}
                    onChange={handleInputChange}
                    /*isInvalid={formErrors.category}*/
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                  {/*<Form.Control.Feedback type='invalid'>*/}
                  {/*    {formErrors.category}*/}
                  {/*</Form.Control.Feedback>*/}
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
            {editingVendor ? "Update Product" : "Add Product"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Vendor;
