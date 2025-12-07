import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./Dashboard.css";

interface ITest {
  _id: string;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
}

const Dashboard: React.FC = () => {
  const [tests, setTests] = useState<ITest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch tests from backend
  const fetchTests = async () => {
    try {
      const res = await axios.get("/tests");
      setTests(res.data);
    } catch (err) {
      console.error("Failed to fetch tests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Navigate to Test Instructions page
  const handleStartTest = (testId: string) => {
    navigate(`/tests/${testId}/instructions`);
  };

  return (
    <div className="dashboard">
      <h1>Available Tests</h1>

      {loading ? (
        <p className="loading">Loading tests...</p>
      ) : tests.length === 0 ? (
        <p className="empty">No tests available. Please wait...</p>
      ) : (
        <div className="test-grid">
          {tests.map((test) => (
            <div key={test._id} className="test-card">
              <h2>{test.title}</h2>
              <p>{test.description}</p>
              <p className="test-info">
                Duration: {test.duration} min | Marks: {test.totalMarks}
              </p>
              <button
                className="start-btn"
                onClick={() => handleStartTest(test._id)}
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
