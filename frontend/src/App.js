import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import WardenDashboard from "./components/WardenDashboard";
import AppNavbar from "./components/Navbar";
import Home from "./components/Home";

const ProtectedRoute = ({ children, role }) => {
  const raw = localStorage.getItem("user");
  if (!raw) return <Navigate to="/login" />;
  const user = JSON.parse(raw);
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  const raw = localStorage.getItem("user");
  const defaultRoute = raw ? (JSON.parse(raw).role === "student" ? "/student" : "/warden") : "/login";

  return (
    <Router>
      <AppNavbar />
      <div className="container my-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={
            <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/warden" element={
            <ProtectedRoute role="warden"><WardenDashboard /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to={defaultRoute} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
