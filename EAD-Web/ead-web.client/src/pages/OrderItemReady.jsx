import { useCallback, useEffect, useState } from "react";
import { Form, Pagination, Spinner, Table } from "react-bootstrap";
import Toast from "../components/Toast";
import ConfirmAction from "../components/ConfirmAction";
import { fetchVenderOrder, setOrderItemStatus } from "../apis/orders";

const OrderItemReady = () => {
  const [selectedOrderItemId, setSelectedOrderItemId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of products to show per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
  const handleShowConfirm = (id) => {
    setSelectedOrderItemId(id);
    setShowConfirm(true);
  };
  const handleConfirmAction = async () => {
    setShowConfirm(false); // Hide confirmation dialo
    setShowSpinner(true); // Show spinner before starting the action
    try {
      await updateOrderStatus(selectedOrderItemId, "Ready");
    } catch (error) {
      console.error("Error during action:", error);
    } finally {
      setShowSpinner(false); // Hide spinner after the action is complete
    }
  };

  const loadOrders = useCallback(async () => {
    try {
      const data = await fetchVenderOrder("66fc3606342696db9557e652");
      if (data.status === "NOK") {
        handleToastShow(data.message, "danger");
        setOrders([]);
        return;
      }
      if (data.data.length === 0) {
        handleToastShow("No order items found", "warning", "Warning");
        setOrders([]);
        return;
      }
      setOrders(data.data);
    } catch (err) {
      setOrders([]);
      console.error(err.message);
      handleToastShow("Error order items outlets", "danger");
    }
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const data = await setOrderItemStatus(orderId, status);

      if (data.status === "NOK") {
        handleToastShow(data.message, "danger");
        return;
      }
      handleToastShow(data.message, "success");
      loadOrders();
    } catch (err) {
      console.error(err.message);
      handleToastShow("Error updating order status", "danger");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setShowSpinner(true);
      loadOrders();
      setShowSpinner(false);
    };
    fetchData();
  }, [loadOrders]);

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
        message={"This will set order to as ready."}
        confirmLabel={"Yes, Ready"}
        confirmVariant={"primary"}
      />

      <div className="container ">
        <h2 className="d-flex justify-content-center">Orders</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Customer Email</th>
              <th>Customer Address</th>
              <th>Order Date</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Stock Available</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {showSpinner && (
              <tr>
                <td colSpan="8">
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
                    <td>{order.cusEmail}</td>
                    <td>{order.cusAddress}</td>
                    <td>{order.orderDate}</td>
                    <td>{order.productName}</td>
                    <td>{order.quantity}</td>
                    <td
                      style={{
                        backgroundColor:
                          order.stockAvailable < order.quantity
                            ? "red"
                            : "inherit",
                      }}
                    >
                      {order.stockAvailable}
                    </td>
                    <td>
                      <Form.Select
                        name="customer"
                        value={order.status}
                        onChange={() => {
                          handleShowConfirm(order.id);
                        }}
                      >
                        <option value="">Select Status</option>
                        {order.stockAvailable >= order.quantity ? (
                          <>
                            <option value="Paid">Paid</option>
                            <option value="Ready">Ready</option>
                          </>
                        ) : null}
                        <option value="Cancelled">Cancelled</option>
                      </Form.Select>
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
      </div>
    </>
  );
};

export default OrderItemReady;
