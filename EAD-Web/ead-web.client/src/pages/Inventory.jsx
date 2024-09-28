import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { FaTrash, FaEdit, FaBell } from "react-icons/fa";

// Mock Data for Inventory Items
const initialInventory = [
  { id: 1, productName: "Product 1", stock: 100, lowStock: 10 },
  { id: 2, productName: "Product 2", stock: 5, lowStock: 20 },
  { id: 3, productName: "Product 3", stock: 50, lowStock: 15 },
  { id: 4, productName: "Product 4", stock: 2, lowStock: 5 },
];

const Inventory = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [lowStockAlert, setLowStockAlert] = useState([]);

  // Check stock levels and notify vendors for low stock
  useEffect(() => {
    const alerts = inventory.filter((item) => item.stock <= item.lowStock);
    setLowStockAlert(alerts);
  }, [inventory]);

  const handleStockUpdate = (id, newStock) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: newStock } : item))
    );
  };

  const handleRemoveStock = (id) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className='container'>
      <h2 className='my-4 d-flex justify-content-center'>Inventory</h2>

      {/* Low Stock Alerts */}
      {lowStockAlert.length > 0 && (
        <div className='alert alert-warning'>
          <FaBell /> Low Stock Alert for Products:
          <ul>
            {lowStockAlert.map((item) => (
              <li key={item.id}>{item.productName}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Inventory Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.productName}</td>
              <td>{item.stock}</td>
              <td>
                <button
                  className='btn btn-secondary mx-1'
                  onClick={() => handleStockUpdate(item.id, item.stock + 10)}
                >
                  <FaEdit />
                </button>
                <button
                  className='btn btn-danger mx-1'
                  onClick={() => handleRemoveStock(item.id)}
                  disabled={item.stock <= 0}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Inventory;
