import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./Result.css";

interface IAnswer {
  question: string; // question ID
  selectedOption: string;
}

interface IResult {
  testTitle: string;
  totalQuestions: number;
  answers: IAnswer[];
  score: number;
}

const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<IResult | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchResult = async () => {
    try {
      const res = await axios.get(`/attempts/${id}`);
      setResult(res.data);
    } catch (err) {
      console.error("Failed to fetch result:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [id]);

  if (loading) return <p className="loading">Loading result...</p>;
  if (!result) return <p className="empty">Result not found.</p>;

  return (
    <div className="result-container">
      <h1>Test Result: {result.testTitle}</h1>
      <p>Total Questions: {result.totalQuestions}</p>
      <p>Correct Answers: {result.score}</p>
      <p>Marks Obtained: {result.score}</p>

      <h3>Your Answers:</h3>
      <ul>
        {result.answers.map((ans, idx) => (
          <li key={idx}>
            Question ID: {ans.question} | Your Answer: {ans.selectedOption}
          </li>
        ))}
      </ul>

      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default Result;
