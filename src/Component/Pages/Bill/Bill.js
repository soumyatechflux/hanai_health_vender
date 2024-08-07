import React, { Fragment, useState, useEffect } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import './bill.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFilePdf } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { BillReportAPI } from "../../../api.js"; 

const Bill = () => {
  const [Bill, setBill] = useState([]); 
  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showPdf, setShowPdf] = useState(false); // State to manage PDF modal
  const [pdfUrl, setPdfUrl] = useState(''); // State to store PDF URL
  const [editData, setEditData] = useState({ id: "", Sr: "", billId: "", amount: "", createdAt: "" });
  const [newData, setNewData] = useState({ Sr: "", billId: "", amount: "", createdAt: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchBillReport = async () => {
    try {
      const timer = setTimeout(async () => {
      try {

      const response = await BillReportAPI();
      if (!response?.data?.data?.bills) {
        throw new Error("Invalid response structure");
      }
      setBill(response?.data?.data?.bills);
    } catch (apiError) {
      console.error("Error fetching data:", apiError);
      setError("Failed to fetch data. Please try again.");
    }
  }, 10); // 10

  // Cleanup the timer if the component unmounts before the timeout completes
  return () => clearTimeout(timer);

    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchBillReport();
    fetchBillReport();
  }, []);

  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseCreate = () => setShowCreate(false);

  const handleSaveCreate = () => {
    const newId = Bill.length ? Math.max(...Bill.map((e) => e.id)) + 1 : 1; 
    setBill([...Bill, { id: newId, Sr: newData.Sr, billId: newData.billId, amount: newData.amount, createdAt: newData.createdAt }]); 
    setShowCreate(false);
    setNewData({ Sr: "", billId: "", amount: "", createdAt: "" });
  };

  const handleCreate = () => setShowCreate(true);

  const handleDelete = (id) => {
    setBill(Bill.filter((e) => e.id !== id)); 
  };

  const handleShowPdf = () => {
    const url =  '/pdfs/bill_details.pdf';
    setPdfUrl(url);
    setShowPdf(true);
  };

  return (
    <Fragment>
      <div className="container bill-main-container" style={{ marginTop: '2.6%' }}>
        <div className="d-flex align-items-center justify-content-between top-margin-heading">
          <h1 className="text-class">Bill Details</h1>
        </div>

        {/* {error && <p className="text-danger">{error}</p>} */}

        <Table responsive striped bordered hover size="sm" className="table-resp">
          <thead>
            <tr>
              <th className="col-1 col-md-1">Sr No</th>
              <th className="col-3 col-md-3">Bill Id</th>
              <th className="col-2 col-md-2">Amount</th>
              <th className="col-3 col-md-3">Bill Date</th>
              <th className="col-3 col-md-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Bill.length > 0
              ? Bill.map((item, index) => (
                  <tr key={item.id}>
                    <td style={{ padding: '6px' }}>{index + 1}</td> 
                    <td style={{ padding: '6px' }}>{item.bill_id}</td>
                    <td style={{ padding: '6px' }}>{item.amount}</td>
                    <td style={{ textWrap: 'nowrap', padding: '6px' }}>{new Date(item.bill_date).toLocaleDateString()}</td>
                    <td className="action-users" style={{ padding: '6px' }}>
                      <a
                        href="#"
                        onClick={() => handleShowPdf(item.actions ? item.actions : '')}
                        style={{ cursor: 'pointer' }}
                      >
                        <FaFilePdf style={{ color: 'red', fontSize: '20px', margin: '7px' }} />
                      </a>
                    </td>
                  </tr>
                ))
              : <tr><td colSpan="5" className="text-center">Loading...</td></tr>}
          </tbody>
        </Table>
        <br />
        <Modal show={showPdf} onHide={() => setShowPdf(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>PDF Viewer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                style={{ width: '100%', height: '600px' }}
                frameBorder="0"
              />
            ) : (
              <p>No PDF available</p>
            )}
          </Modal.Body>
        </Modal>
        {/* Add Create Modal and Edit Modal code here */}
      </div>
    </Fragment>
  );
};

export default Bill;
