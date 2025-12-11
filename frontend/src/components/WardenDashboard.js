import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge, ButtonGroup } from "react-bootstrap";
import API from "../api";

export default function WardenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching complaints");
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/complaints/${id}`, { status });
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return <Badge bg="warning">Pending</Badge>;
      case "Accepted": return <Badge bg="primary">Accepted</Badge>;
      case "Rectified": return <Badge bg="success">Rectified</Badge>;
      case "Rejected": return <Badge bg="danger">Rejected</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const filtered = complaints.filter(c => filter === "All" ? true : c.status === filter);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Complaints</h2>
        <div>
          <ButtonGroup>
            <Button variant={filter === "All" ? "primary" : "outline-primary"} onClick={() => setFilter("All")}>All</Button>
            <Button variant={filter === "Pending" ? "primary" : "outline-primary"} onClick={() => setFilter("Pending")}>Pending</Button>
            <Button variant={filter === "Accepted" ? "primary" : "outline-primary"} onClick={() => setFilter("Accepted")}>Accepted</Button>
            <Button variant={filter === "Rectified" ? "primary" : "outline-primary"} onClick={() => setFilter("Rectified")}>Rectified</Button>
            <Button variant={filter === "Rejected" ? "primary" : "outline-primary"} onClick={() => setFilter("Rejected")}>Rejected</Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="container-card">
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan="7" className="text-center">No complaints</td></tr>
            )}
            {filtered.map(c => (
              <tr key={c._id}>
                <td>{c.user?.name}</td>
                <td>{c.user?.email}</td>
                <td>{c.title}</td>
                <td>{c.description}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
                <td>{getStatusBadge(c.status)}</td>
                <td>
                  {c.status === "Pending" && (
                    <>
                      <Button size="sm" className="me-1" onClick={() => updateStatus(c._id, "Accepted")}>Accept</Button>
                      <Button size="sm" variant="danger" className="me-1" onClick={() => updateStatus(c._id, "Rejected")}>Reject</Button>
                    </>
                  )}
                  {c.status !== "Rectified" && (
                    <Button size="sm" variant="success" onClick={() => updateStatus(c._id, "Rectified")}>Rectify</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}
