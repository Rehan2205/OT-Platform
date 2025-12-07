import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewAttempts: React.FC = () => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/admin/attempts")
      .then(res => setAttempts(res.data.attempts))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Attempts</h2>

      <table border={1} cellPadding={10} style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>User Email</th>
            <th>Test Name</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {attempts.map((attempt: any, index) => (
            <tr key={index}>
              <td>{attempt.userEmail}</td>
              <td>{attempt.testName}</td>
              <td>{attempt.score}</td>
              <td>{attempt.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAttempts;
