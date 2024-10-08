import { useCallback, useEffect, useState } from "react";
import { Button, Pagination, Spinner, Table } from "react-bootstrap";
import Toast from "../components/Toast";
import ConfirmAction from "../components/ConfirmAction";
import { fetchCancelRequests, setCancelRequestStatus } from "../apis/orders";

const CancelRequests = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [requestes, setRequestes] = useState([]);
  const [isApprove, setIsApprove] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of products to show per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = requestes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(requestes.length / itemsPerPage);
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
  const loadRequests = useCallback(async () => {
    try {
      const data = await fetchCancelRequests();
      if (data.status === "NOK") {
        handleToastShow(data.message, "danger");
        setRequestes([]);
        return;
      }
      if (data.data.length === 0) {
        handleToastShow("No cancel requests found", "warning", "Warning");
        setRequestes([]);
        return;
      }
      setRequestes(data.data);
    } catch (err) {
      setRequestes([]);
      console.error(err.message);
      handleToastShow("Error loading cancel requests", "danger");
    }
  }, []);

  const updateRequestStatus = async (requestId, isApproved) => {
    try {
      const data = await setCancelRequestStatus(requestId, isApproved);

      if (data.status === "NOK") {
        handleToastShow(data.message, "danger");
        return;
      }
      handleToastShow(data.message, "success");
      loadRequests();
    } catch (err) {
      console.error(err.message);
      handleToastShow("Error updating order status", "danger");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setShowSpinner(true);
      loadRequests();
      setShowSpinner(false);
    };
    fetchData();
  }, [loadRequests]);

  const handleShowConfirm = (type, id) => {
    setIsApprove(type === "approve");
    setSelectedRequestId(id);
    setShowConfirm(true);
  };
  const handleConfirmAction = async () => {
    setShowSpinner(true); // Show spinner before starting the action
    try {
      setShowConfirm(false); // Hide confirmation dialog
      await updateRequestStatus(selectedRequestId, isApprove);
    } catch (error) {
      console.error("Error during action:", error);
    } finally {
      setShowSpinner(false); // Hide spinner after the action is complete
    }
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
        message={isApprove ? "Approve this request?" : "Reject this request?"}
        confirmLabel={isApprove ? "Approve" : "Reject"}
        confirmVariant={"primary"}
      />

      <div className="container ">
        <h2 className="d-flex justify-content-center">Orders</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Customer Email</th>
              <th>Customer Name</th>
              <th>Comment</th>
              <th>Request Date</th>
              <th>Action</th>
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
            {!showSpinner &&
              currentRequests &&
              currentRequests.length !== 0 && (
                <>
                  {currentRequests.map((order) => (
                    <tr key={order.id}>
                      <td>{order.invoiceNo}</td>
                      <td>{order.cusEmail}</td>
                      <td>{order.cusName}</td>
                      <td>{order.comment}</td>
                      <td>{order.createdAt}</td>
                      <td>
                        <Button
                          variant={"success"}
                          onClick={() => handleShowConfirm("approve", order.id)}
                          className="me-2"
                        >
                          Approve
                        </Button>
                        <Button
                          variant={"danger"}
                          onClick={() => handleShowConfirm("reject", order.id)}
                        >
                          Reject
                        </Button>
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

export default CancelRequests;
