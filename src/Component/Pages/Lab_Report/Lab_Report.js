import React, { Fragment, useState, useEffect } from "react";
import { Button, Table, Modal, Spinner } from "react-bootstrap";
import "./lab.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LabReportAPI, UploadPdfOfLabReport } from "../../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Lab_Report = () => {
  const [labReports, setLabReports] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    customer_id: "",
    type: "",
    venue: "",
    date: "",
    time_slot: "",
    file_path: "",
    pdf: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const fetchLabReport = async () => {
  //   try {
  //     const response = await LabReportAPI();
  //     if (response?.data?.response === true) {
  //       // Correct property name based on your API response
  //       setLabReports(response?.data?.data?.labreports || []);
  //     } else {
  //       toast.error(response?.data?.error_msg || "Failed to fetch lab reports.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     toast.error("Failed to fetch data. Please try again.");
  //   }
  // };

  // const token = localStorage.getItem("encryptedTokenForVendorOfHanaiHealth");
  // useEffect(() => {
  //   if (token) {
  //     fetchLabReport();
  //   }
  // }, [token]); 




  // Fetch lab reports with a delay
  const fetchLabReport = async () => {
    try {
      const timer = setTimeout(async () => {
        try {
          const response = await LabReportAPI();
          if (response?.data?.response === true) {
            setLabReports(response?.data?.data?.labreports || []);
          } else {
            toast.error(response?.data?.error_msg || "Failed to fetch lab reports.");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          // toast.error("Failed to fetch data. Please try again.");
        }
      }, 10); // 10 ms delay

      // Cleanup the timer if the component unmounts before the timeout completes
      return () => clearTimeout(timer);
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchLabReport();
  }, []);



  const handleEdit = (report) => {
    setEditData({
      id: report.id,
      customer_id: report.customer_id,
      type: report.type,
      venue: report.venue,
      date: new Date(report.date).toLocaleDateString(),
      time_slot: report.time_slot,
      file_path: report.file_path,
      pdf: null,
    });
    setShowEditModal(true);
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setEditData({ ...editData, pdf: file, file_path: URL.createObjectURL(file) });
    } else {
      toast.error("Please select a valid PDF file.");
    }
  };

  const handlePdfDeselect = () => {
    setEditData({ ...editData, pdf: null, file_path: "" });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!editData.pdf) {
      toast.error("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("customer_id", editData.customer_id);
    formData.append("id", editData.id);
    formData.append("labReportPath", editData.pdf);

    try {
      setLoading(true);
      const response = await UploadPdfOfLabReport(formData);
      setLoading(false);

      if (response.data.response === true) {
        toast.success( response.data.success_msg || "File uploaded successfully.");
        fetchLabReport();
        setShowEditModal(false);
      } else {
        toast.error(response.data.error_msg || "Failed to upload file.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to upload file.", error);
      toast.error("Failed to upload file.");
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  return (
    <Fragment>
      <div className="container user-main-container" style={{ marginTop: "2.6%" }}>
        <div className="d-flex align-items-center justify-content-between top-margin-heading">
          <h1 className="text-class">Lab Report</h1>
          <div className="btn-class" style={{ visibility: "hidden" }}>
            <Button size="lg" className="add-btn">
              Lab Report
            </Button>
          </div>
        </div>

        <Table
          responsive
          striped
          bordered
          hover
          size="sm"
          className="table-resp"
          style={{ marginTop: "1%" }}
        >
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
            {labReports.length > 0 ? (
              labReports.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.type}</td>
                  <td>{item.venue}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.time_slot}</td>
                  <td className="action-users">
                    <Button
                      style={{ color: "#454545", width: "80px" }}
                      variant="link"
                      onClick={() => handleEdit(item)}
                    >
                      <FaEdit style={{ fontSize: "20px", margin: "2px" }} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No Lab Reports Available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <br />
      </div>

      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>View Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-container">
            <div className="form-group">
              <strong>Test Name:</strong>
              <span>{editData.type}</span>
            </div>
            <div className="form-group">
              <strong>Venue:</strong>
              <span>{editData.venue}</span>
            </div>
            <div className="form-group">
              <strong>Date:</strong>
              <span>{editData.date}</span>
            </div>
            <div className="form-group">
              <strong>Time:</strong>
              <span>{editData.time_slot}</span>
            </div>
            <div className="form-group">
              <strong>PDF:</strong>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.9em",
                }}
              >
                {editData?.file_path ? (
                  <>
                    <iframe
                      src={editData.file_path}
                      style={{
                        width: "100%",
                        height: "200px",
                        border: "1px solid #ddd",
                      }}
                      title="PDF Preview"
                    />
                    <Button
                      variant="link"
                      style={{
                        position: "absolute",
                        top: "5px",
                        left: "5px",
                        color: "black",
                        padding: 0,
                        background: "transparent",
                        border: "none",
                        fontSize: "1.5em",
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
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button
            style={{ backgroundColor: "red", color: "white", border: "none" }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default Lab_Report;
