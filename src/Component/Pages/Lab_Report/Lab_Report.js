import React, { Fragment, useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import './lab.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AiFillFilePdf } from "react-icons/ai"; // Importing PDF icon
import UserEmployeesData from "./UserEmployees";// Renamed to EmployeesData to avoid confusion

const Lab_Report = () => {
  const [employees, setEmployees] = useState(UserEmployeesData);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({ id: "", Sr: "", name: "", location: "", createdAt: "", time: "", pdf: null });

  let history = useNavigate();

  // Edit Operation
  const handleEdit = (id, Sr, name, location, createdAt, time, pdf) => {
    setEditData({ id, Sr, name, location, createdAt, time, pdf });
    setShowEdit(true);
  };

  // Handle PDF Upload
  const handlePdfUpload = (e) => {
    setEditData({ ...editData, pdf: e.target.files[0] });
  };

  // Handle PDF Deselect
  const handlePdfDeselect = () => {
    setEditData({ ...editData, pdf: null });
  };

  // Handle modal close
  const handleCloseEdit = () => setShowEdit(false);

  // Handle Save Changes
  const handleSave = () => {
    // Logic to save the changes, e.g., update state or call API
    setShowEdit(false);
  };

  return (
    <Fragment>
      <div className="container user-main-container" style={{ marginTop: '2.6%' }}>
        <div className="d-flex align-items-center justify-content-between top-margin-heading">
          <h1 className="text-class">Lab Report</h1>

          {/* Add button is */}
          <div className=" btn-class" style={{ visibility: 'hidden' }}>
            <Button size="lg" className="add-btn">Lab Report</Button>
          </div>
        </div>

        <Table responsive striped bordered hover size="sm" className="table-resp" style={{marginTop:'1%'}}>
          <thead>
            <tr>
              <th className="col-1 col-md-1">Sr No</th>
              <th className="col-3 col-md-3">Test Name</th>
              <th className="col-2 col-md-2">Venue</th>
              <th className="col-3 col-md-3">Date</th>
              <th className="col-2 col-md-2">Time</th>
              <th className="col-1 col-md-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees && employees.length > 0
              ? employees.map((item) => (
                <tr key={item.id}>
                  <td>{item.Sr}</td>
                  <td>{item.Name}</td>
                  <td>{item.location}</td>
                  <td style={{ textWrap: 'nowrap' }}>{item.createdAt}</td>
                  <td>{item.time}</td>
                  <td className="action-users">
                    <Button style={{ color: '#454545', width: '80px' }}
                      variant="link"
                      onClick={() => handleEdit(item.id, item.Sr, item.Name, item.location, item.createdAt, item.time, item.pdf)}
                    >
                      <FaEdit style={{ fontSize: '20px', margin: '2px' }} />
                    </Button>
                    {/* <Button style={{ color: 'red' }}
                      variant="link"
                      className="mx-2"
                      onClick={() => handleDelete(item.id)}
                    >
                      <MdDelete />
                    </Button> */}
                  </td>
                </tr>
              ))
              : <p className="mt-2">No data available</p>}
          </tbody>
        </Table>
        <br />
        {/* <div className="d-grid gap-2" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button size="lg" onClick={handleCreate}>Add Users</Button>
        </div> */}
      </div>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={handleCloseEdit} centered>
  <Modal.Header closeButton>
    <Modal.Title>View Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="form-container">
      <div className="form-group">
        <strong>Sr No:</strong>
        <span>{editData.Sr}</span>
      </div>
      <div className="form-group">
        <strong>Name:</strong>
        <span>{editData.name}</span>
      </div>
      <div className="form-group">
        <strong>Venue:</strong>
        <span>{editData.location}</span>
      </div>
      <div className="form-group">
        <strong>Time Slot:</strong>
        <span>{editData.time}</span>
      </div>
      <div className="form-group">
        <strong>Date:</strong>
        <span>{editData.createdAt}</span>
      </div>
      <div className="form-group">
        <strong>PDF:</strong>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', fontSize: '0.9em' }}>
          {editData.pdf ? (
            <>
              <iframe
                src={URL.createObjectURL(editData.pdf)}
                style={{ width: '100%', height: '200px', border: '1px solid #ddd' }}
                title="PDF Preview"
              />
              <Button
                variant="link"
                style={{
                  position: 'absolute',
                  top: '5px',
                  left: '5px',
                  color: 'black',
                  padding: 0,
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5em',
                }}
                onClick={handlePdfDeselect}
              >
                ×
              </Button>
            </>
          ) : ( 
            "No PDF Selected"
          )}
        </div>
      </div>
      <div className="form-group">
        <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
      </div>
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseEdit}>
      Close
    </Button>
    <Button style={{ backgroundColor: 'red', color: 'white', border: 'none' }} onClick={handleSave}>
      Save
    </Button>
  </Modal.Footer>
</Modal>


    </Fragment>
  );
};

export default Lab_Report;
