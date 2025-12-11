import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge, Modal, Form } from "react-bootstrap";
import API from "../api";

export default function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching complaints");
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return <Badge bg="warning">Pending</Badge>;
      case "Accepted": return <Badge bg="primary">Accepted</Badge>;
      case "Rectified": return <Badge bg="success">Rectified</Badge>;
      case "Rejected": return <Badge bg="danger">Rejected</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/complaints", formData);
      setFormData({ title: "", description: "" });
      setShowModal(false);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting complaint");
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>My Complaints</h2>
        <Button onClick={() => setShowModal(true)}>Submit Complaint</Button>
      </div>

      <div className="container-card">
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
            {complaints.length === 0 && (
              <tr><td colSpan="4" className="text-center">No complaints yet</td></tr>
            )}
            {complaints.map(c => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td>{c.description}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
                <td>{getStatusBadge(c.status)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Submit Complaint</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit" className="w-100">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
