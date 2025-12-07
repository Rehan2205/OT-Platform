import React, { useState } from "react";
import axios from "../../api/axios";
import "./CreateTest.css";

const CreateTest: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [totalMarks, setTotalMarks] = useState("");

  const createTest = async () => {
    try {
      const res = await axios.post(
        "/tests",
        {
          title,
          description,
          duration: Number(duration),
          totalMarks: Number(totalMarks),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Test Created Successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create test");
    }
  };

  return (
    <div className="create-test-container">
      <h2>Create New Test</h2>

      <input
        type="text"
        placeholder="Test Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Test Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <input
        type="number"
        placeholder="Total Marks"
        value={totalMarks}
        onChange={(e) => setTotalMarks(e.target.value)}
      />

      <button onClick={createTest}>Create Test</button>
    </div>
  );
};

export default CreateTest;
