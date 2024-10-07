import React, { useEffect, useState } from "react";
import { Table, Button, Pagination } from "react-bootstrap";
import { fetchPendingUsers } from "../apis/fetchPendingusers";
import { approveUser } from "../apis/approveUser";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  // Import the toast styles

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of users to show per page

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = pendingUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pendingUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
            {currentUsers.map((user) => (
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
      />
    </div>
  );
};

export default PendingUsers;



















// import React, { useEffect, useState } from "react";
// import { Table, Button } from "react-bootstrap";
// import { fetchPendingUsers } from "../apis/fetchPendingusers";
// import { approveUser } from "../apis/approveUser";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';  // Import the toast styles

// const PendingUsers = () => {
//   const [pendingUsers, setPendingUsers] = useState([]);



//   useEffect(() => {
//     const getPendingUsers = async () => {
//       try {
//         const data = await fetchPendingUsers();
//         setPendingUsers(data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     getPendingUsers();
//   }, []);

//   const handleApproveUser = async (userId) => {
//     try {
//       await approveUser(userId);
//       setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
//       toast.success(`User approved successfully!`);
//     } catch (error) {
//       console.error("Error approving user", error);
//       toast.error("Error approving user");
//     }
//   };

//   return (
//     <div>
//       <div className="container">
//         <h2 className="d-flex justify-content-center">
//           Pending Vendor Approval Requests
//         </h2>

//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pendingUsers.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.email}</td>
//                 <td>{user.role}</td>
//                 <td>
//                   <Button
//                     variant={"success"}
//                     onClick={() => handleApproveUser(user.id)}
//                     className="me-2"
//                   >
//                     Approve
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//       <ToastContainer
// position="top-right"
// autoClose={5000}
// hideProgressBar={false}
// newestOnTop={false}
// closeOnClick
// rtl={false}
// pauseOnFocusLoss
// draggable
// pauseOnHover
// theme="light"
// transition: Bounce
//       />
//     </div>
//   );
// };

// export default PendingUsers;
