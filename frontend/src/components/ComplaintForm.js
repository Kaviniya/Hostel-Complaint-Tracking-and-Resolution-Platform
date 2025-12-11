import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge, Modal, Form } from "react-bootstrap";
import axios from "axios";
import AppNavbar from "../components/Navbar";

export default function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const token = localStorage.getItem("token");

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return <Badge bg="warning">Pending</Badge>;
      case "Accepted": return <Badge bg="primary">Accepted</Badge>;
      case "Rectified": return <Badge bg="success">Rectified</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/complaints", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ title: "", description: "" });
      setShowModal(false);
      fetchComplaints(); // Refresh complaint list
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting complaint");
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        <h2 className="mb-3 text-center">Student Dashboard</h2>
        <div className="d-flex justify-content-end mb-3">
          <Button onClick={() => setShowModal(true)}>Submit Complaint</Button>
        </div>

        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td>{c.description}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
                <td>{getStatusBadge(c.status)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Complaint Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Submit Complaint</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button type="submit" className="w-100">Submit</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
