// Dashboard.js
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const { user } = useContext(AuthContext);


  // Define card data for each role
  const adminCards = [
    {
      id: "orders",
      title: "Order Management",
      text: "Manage and track all orders.",
      image:
        "https://wareiq-prelogin.s3.ap-south-1.amazonaws.com/wp-content/uploads/2023/08/28192525/all-in-one-order-management-1124x632.jpeg",
      link: "/OrderManagement",
    },
    {
      id: "readyOrders",
      title: "Ready Orders",
      text: "View and confirm ready orders.",
      image:
        "https://business.adobe.com/blog/basics/media_1df3e3d5a2396474f8f90ab0f72f9dd55cb9233bd.png?width=750&format=png&optimize=medium",
      link: "/ConfirmOrder",
    },
    {
      id: "productManagement",
      title: "Product Management",
      text: "Manage your product listings.",
      image:
        "https://www.marketing91.com/wp-content/uploads/2015/06/What-is-product-management.jpg",
      link: "/Products",
    },
    {
      id: "inventoryManagement",
      title: "Inventory Management",
      text: "Track and manage inventory levels.",
      image:
        "https://cashflowinventory.com/blog/wp-content/uploads/2023/02/inventory-analysis.webp",
      link: "/Inventory",
    },
    {
      id: "vendorManagement",
      title: "Vendor Management",
      text: "Manage vendor relationships.",
      image:
        "https://media.licdn.com/dms/image/D4D12AQGj5-nuernKvA/article-cover_image-shrink_720_1280/0/1694788197905?e=2147483647&v=beta&t=7QXmnSzxNIfbZ8XHEvJ3EgtU2CAZ59Cg-9kIJ4rUbeQ",
      link: "/Vendor",
    },
    {
      id: "vendorAccountManagement",
      title: "Vendor Account Management",
      text: "Manage vendor accounts and permissions.",
      image:
        "https://www.freshbooks.com/wp-content/uploads/2021/09/account-management-software.jpg",
      link: "/PendingUsers",
    },
    {
      id: "customerAccountManagement",
      title: "Customer Account Management",
      text: "Manage customer accounts and activations.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM_LdcQ3l_T24DuyoDgmWJPJo5Kg59lyI0jA&s",
      link: "/CustomerActivation",
    },
  ];

  const vendorCards = [
    {
      id: "vendorProductManagement",
      title: "Product Management",
      text: "Manage your products.",
      image:
        "https://www.marketing91.com/wp-content/uploads/2015/06/What-is-product-management.jpg",
      link: "/Products",
    },
    {
      id: "vendorInventoryManagement",
      title: "Inventory Management",
      text: "Track your inventory.",
      image:
        "https://cashflowinventory.com/blog/wp-content/uploads/2023/02/inventory-analysis.webp",
      link: "/Inventory",
    },
    // Add more Vendor-specific cards if needed
  ];

  const csrCards = [
    {
      id: "customerOrderManagement",
      title: "Customer Order Management",
      text: "Manage customer orders efficiently.",
      image:
        "https://www.smartsheet.com/sites/default/files/ic-og-CustomerOrderManagement-FacebookLinkedIn.jpg",
      link: "#customer-orders",
    },
    {
      id: "customerAccountManagement",
      title: "Customer Account Management",
      text: "Activate and manage customer accounts.",
      image:
        "https://t4.ftcdn.net/jpg/07/19/82/87/360_F_719828772_iQ5gIUAmuyGnTt6SmTfnTBXYNGqkt9uN.jpg",
      link: "/CustomerActivation",
    },
    {
      id: "accountReactivation",
      title: "Account Re-Activation Management",
      text: "Re-activate customer accounts as needed.",
      image:
        "https://png.pngtree.com/thumb_back/fh260/background/20220430/pngtree-woman-using-a-labtop-computer-background-business-laptop-working-at-home-photo-image_27847524.jpg",
      link: "/ReActivateCustomer",
    },
  ];

  // Function to get cards based on user role
  const getCardsByRole = () => {
    switch (user && user.role) {
      case "Admin":
        return adminCards;
      case "Vendor":
        return vendorCards;
      case "CSR":
        return csrCards;
      default:
        return [];
    }
  };

  const cardsToDisplay = getCardsByRole();

  // Handler for card clicks
  const handleCardClick = (link) => {
    navigate(link);
  };

  return (
    <div className="container mt-5">
      <h4 className="d-flex justify-content-center mb-4">
        Welcome to VendiCore
      </h4>
      {cardsToDisplay.length > 0 ? (
        <div className="row">
          {cardsToDisplay.map((card) => (
            <div key={card.id} className="col-md-4 mb-4">
              <div
                className="card h-100 clickable-card"
                onClick={() => handleCardClick(card.link)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={card.image}
                  className="card-img-top"
                  alt={card.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{card.title}</h5>
                  <p className="card-text">{card.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">
          No dashboard items available for your role.
        </p>
      )}
    </div>
  );
};

export default Dashboard;

// // const Dashboard = () => {
// //   return (
// //     <div className='container'>
// //       <h4 className='d-flex justify-content-center'>Dashboard</h4>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// // Dashboard.js
// import React ,{useContext}from 'react';
// import { Link, useNavigate } from "react-router-dom";
// import AuthContext from '../contexts/AuthContext';

// const Dashboard = () => {
//   const navigate = useNavigate(); // Initialize the navigate function
//   const { user, setUser } = useContext(AuthContext);

//   console.log("User Role",user.role);

//   // Sample data for the cards
//   const cards = [
//     {
//       id: 'orders',
//       title: 'Orders',
//       text: 'This is some example text for Card A.',
//       image: 'https://cdn.iveybusinessjournal.com/wp-content/uploads/2002/11/iStock_000022736460_Large.jpg', // Replace with your image URL
//       link: '/OrderManagement', // Destination route
//     },
//     {
//       id: 'readyOrders',
//       title: 'Ready Orders',
//       text: 'This is some example text for Card B.',
//       image: 'https://cdn.iveybusinessjournal.com/wp-content/uploads/2002/11/iStock_000022736460_Large.jpg', // Replace with your image URL
//       link: '/ConfirmOrder', // Destination route
//     },
//     {
//       id: 'C',
//       title: 'Product Management',
//       text: 'This is some example text for Card C.',
//       image: 'https://cdn.iveybusinessjournal.com/wp-content/uploads/2002/11/iStock_000022736460_Large.jpg', // Replace with your image URL
//       link: '/Products', // Destination route
//     },
//     {
//       id: 'D',
//       title: 'Inventory Management',
//       text: 'This is some example text for Card C.',
//       image: 'https://cdn.iveybusinessjournal.com/wp-content/uploads/2002/11/iStock_000022736460_Large.jpg', // Replace with your image URL
//       link: '/Inventory', // Destination route
//     },
//     {
//       id: 'E',
//       title: 'Vendor Management',
//       text: 'This is some example text for Card C.',
//       image: 'https://cdn.iveybusinessjournal.com/wp-content/uploads/2002/11/iStock_000022736460_Large.jpg', // Replace with your image URL
//       link: '/Vendor', // Destination route
//     },
//     {
//       id: 'F',
//       title: 'Vendor Account Management',
//       text: 'This is some example text for Card C.',
//       image: 'https://cdn.iveybusinessjournal.com/wp-content/uploads/2002/11/iStock_000022736460_Large.jpg', // Replace with your image URL
//       link: '/PendingUsers', // Destination route
//     },
//     {
//       id: 'G',
//       title: 'Customer Account Management',
//       text: 'This is some example text for Card C.',
//       image: 'https://cdn.iveybusinessjournal.com/wp-content/uploads/2002/11/iStock_000022736460_Large.jpg', // Replace with your image URL
//       link: '/CustomerActivation', // Destination route
//     },
//   ];

//   // Handler for card clicks
//   const handleCardClick = (link) => {
//     navigate(link);
//   };

//   return (
//     <div className="container mt-5">
//       <h4 className="d-flex justify-content-center mb-4">Welcome to VendiCore</h4>

// {user.role ==='Admin' && (    <div className="row">
//         {cards.map((card) => (
//           <div key={card.id} className="col-md-4 mb-4">
//             <div
//               className="card h-100 clickable-card"
//               onClick={() => handleCardClick(card.link)}
//               style={{ cursor: 'pointer' }}
//             >
//               <img
//                 src={card.image}
//                 className="card-img-top"
//                 alt={card.title}
//               />
//               <div className="card-body">
//                 <h5 className="card-title">{card.title}</h5>
//                 <p className="card-text">{card.text}</p>
//               </div>
//               {/* Optional: Additional card content
//               <ul className="list-group list-group-flush">
//                 <li className="list-group-item">An item</li>
//                 <li className="list-group-item">A second item</li>
//                 <li className="list-group-item">A third item</li>
//               </ul>
//               */}
//               {/* Optional: Card links
//               <div className="card-body">
//                 <a href={card.link} className="card-link">Card link</a>
//                 <a href={card.link} className="card-link">Another link</a>
//               </div>
//               */}
//             </div>
//           </div>
//         ))}
//       </div>)}

//       <div className="row">
//         {cards.map((card) => (
//           <div key={card.id} className="col-md-4 mb-4">
//             <div
//               className="card h-100 clickable-card"
//               onClick={() => handleCardClick(card.link)}
//               style={{ cursor: 'pointer' }}
//             >
//               <img
//                 src={card.image}
//                 className="card-img-top"
//                 alt={card.title}
//               />
//               <div className="card-body">
//                 <h5 className="card-title">{card.title}</h5>
//                 <p className="card-text">{card.text}</p>
//               </div>
//               {/* Optional: Additional card content
//               <ul className="list-group list-group-flush">
//                 <li className="list-group-item">An item</li>
//                 <li className="list-group-item">A second item</li>
//                 <li className="list-group-item">A third item</li>
//               </ul>
//               */}
//               {/* Optional: Card links
//               <div className="card-body">
//                 <a href={card.link} className="card-link">Card link</a>
//                 <a href={card.link} className="card-link">Another link</a>
//               </div>
//               */}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
