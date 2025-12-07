import React from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Panel</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-actions">
        <div className="admin-card" onClick={() => navigate("/create-test")}>
          Create Test
        </div>

        <div className="admin-card" onClick={() => navigate("/all-tests")}>
          View All Tests
        </div>

        <div className="admin-card" onClick={() => navigate("/attempts")}>
          View Attempts
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
