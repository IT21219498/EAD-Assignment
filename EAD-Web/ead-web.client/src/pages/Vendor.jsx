import { Table, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { fetchVendors } from "../apis/vendor";

const Vendor = () => {

    const [vendors, setVendors] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        Promise.all([loadVendors()]);
    }, []);

    const loadVendors = async () => {

        try {
            const data = await fetchVendors();
            setVendors(data);
        }
        catch (error) {
            console.error(error);
        }

    }

    return (
        <div className='container '>
            <h2 className='d-flex justify-content-center'>Vendors</h2>
            <Button
                variant='primary'
                className='mb-3'
                onClick={() => handleModalShow()}
            >
                New Vendor
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className='text-center'>Vendor Name</th>
                        <th className='text-center'>Address</th>
                        <th className='text-center'>Contact Name</th>
                        <th className='text-center'>Contact No</th>
                        <th className='text-center'>Email</th>
                        <th className='text-center'>Category</th>
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
        </div>
  );
}

export default Vendor;