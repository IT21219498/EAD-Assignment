import { Table, Button } from "react-bootstrap";
const Vendor = () => {
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
                        <th>Vendor Name</th>
                        <th>Address</th>
                        <th>Contact Name</th>
                        <th>Contact No</th>
                        <th>Email</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </Table>
        </div>
  );
}

export default Vendor;