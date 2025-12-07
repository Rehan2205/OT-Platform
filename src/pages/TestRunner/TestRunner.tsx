import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./TestRunner.css";

interface IQuestion {
  _id: string;
  questionText: string;
  options: string[];
}

interface IAnswer {
  questionId: string;
  answer: string;
}

const TestRunner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  const [attempted, setAttempted] = useState(false); // if user already attempted

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`/questions/${id}`);
        setQuestions(res.data.questions);
        setTimeLeft(res.data.duration * 60);

        // Check if user already attempted
        const attemptRes = await axios.get(`/attempts/check/${id}`);
        if (attemptRes.data.attempted) {
          setAttempted(true);
        }
      } catch (err) {
        setError("Failed to fetch questions or attempt status");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!attempted) handleSubmit(); // auto-submit if not already submitted
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, answer } : a
        );
      } else {
        return [...prev, { questionId, answer }];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/attempts", {
        testId: id,
        answers,
      });
      navigate(`/results/${res.data.attemptId}`);
    } catch (err) {
      console.error("Failed to submit answers:", err);
      alert("Failed to submit answers");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p className="error">{error}</p>;
  if (attempted)
    return (
      <p className="error">
        You have already attempted this test. You cannot retake it.
      </p>
    );
  if (questions.length === 0) return <p>No questions found for this test.</p>;

  return (
    <div className="test-runner-container">
      <h1>Test In Progress</h1>
      <div className="timer">Time Left: {formatTime(timeLeft)}</div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {questions.map((q, idx) => (
          <div key={q._id} className="question-card">
            <p>
              <strong>
                {idx + 1}. {q.questionText}
              </strong>
            </p>
            {q.options.map((opt) => (
              <label key={opt} className="option-label">
                <input
                  type="radio"
                  name={q._id}
                  value={opt}
                  onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                  required
                />
                {opt}
              </label>
            ))}
          </div>
        ))}

        <button type="submit" className="submit-btn">
          Submit Test
        </button>
      </form>
    </div>
  );
};

export default TestRunner;
