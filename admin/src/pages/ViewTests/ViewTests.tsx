import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewTests: React.FC = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/admin/tests")
      .then((res) => setTests(res.data.tests))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Tests</h2>

      <table border={1} cellPadding={10} style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>Test ID</th>
            <th>Test Name</th>
            <th>Total Questions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((t: any, i) => (
            <tr key={i}>
              <td>{t._id}</td>
              <td>{t.title}</td>
              <td>{t.questions?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTests;
