import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { fetchPendingUsers } from "../apis/fetchPendingusers";
import { approveUser } from "../apis/approveUser";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  // Import the toast styles

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);



  useEffect(() => {
    const getPendingUsers = async () => {
      try {
        const data = await fetchPendingUsers();
        setPendingUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    getPendingUsers();
  }, []);

  const handleApproveUser = async (userId) => {
    try {
      await approveUser(userId);
      setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
      toast.success(`User approved successfully!`);
    } catch (error) {
      console.error("Error approving user", error);
      toast.error("Error approving user");
    }
  };

  return (
    <div>
      <div className="container">
        <h2 className="d-flex justify-content-center">
          Pending Vendor Approval Requests
        </h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    variant={"success"}
                    onClick={() => handleApproveUser(user.id)}
                    className="me-2"
                  >
                    Approve
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition: Bounce
      />
    </div>
  );
};

export default PendingUsers;
