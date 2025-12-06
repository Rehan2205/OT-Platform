import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./TestInstructions.css";

interface ITest {
  _id: string;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
}

const TestInstructions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<ITest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`/tests/${id}`); 
        setTest(res.data);
      } catch (err) {
        setError("Unable to fetch test details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  const handleStartTest = () => {
    navigate(`/tests/${id}/run`);
  };

  if (loading) return <p>Loading test instructions...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!test) return <p>No test found</p>;

  return (
    <div className="instructions-container">
      <h1>{test.title}</h1>
      <p>{test.description}</p>
      <p>
        <strong>Duration:</strong> {test.duration} minutes
      </p>
      <p>
        <strong>Total Marks:</strong> {test.totalMarks}
      </p>
      <button className="start-btn" onClick={handleStartTest}>
        Start Test
      </button>
    </div>
  );
};

export default TestInstructions;
