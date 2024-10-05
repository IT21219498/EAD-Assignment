import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  // Import the toast styles
import { Table, Button } from "react-bootstrap";
import { fetchPendingCustomers } from '../apis/fetchPendingCustomer';
import { approveCustomer } from '../apis/approveCustomer';


const CustomerActivation = () => {
    const [pendingCustomers, setPendingPendingCustomers] = useState([]);

    useEffect(() =>{
        const getPendingCustomers = async () =>{
            try{
                const data = await fetchPendingCustomers();
                setPendingPendingCustomers(data);
            }catch(error){
                console.error(error);
            }
        };
        getPendingCustomers();
    })

    const handleApproveCustomer = async(customerId) =>{
        try{
            await approveCustomer(customerId);
            setPendingPendingCustomers(pendingCustomers.filter((user) => user.customerId !== customerId));
            toast.success(`Customer approved successfully!`);
        }catch(error){
        console.error("Error approving customer", error);
    }

    }
  return (
    <div>
      <div className="container">
        <h2 className="d-flex justify-content-center">
          Customer Account Approval Requests
        </h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingCustomers.map((user) => (
              <tr key={user.customerId}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <Button
                    variant={"success"}
                    onClick={() => handleApproveCustomer(user.customerId)}
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
  )
}

export default CustomerActivation
