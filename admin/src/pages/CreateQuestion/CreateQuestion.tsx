import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./CreateQuestion.css";

const CreateQuestion: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [marks, setMarks] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/questions", {
        testId,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        marks,
      });

      alert("Question added!");
      navigate(`/admin/create-question/${testId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to add question");
    }
  };

  return (
    <div className="create-question-container">
      <h1>Add Question</h1>

      <form onSubmit={handleSubmit} className="question-form">
        <label>Question</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <label>Option A</label>
        <input value={optionA} onChange={(e) => setOptionA(e.target.value)} required />

        <label>Option B</label>
        <input value={optionB} onChange={(e) => setOptionB(e.target.value)} required />

        <label>Option C</label>
        <input value={optionC} onChange={(e) => setOptionC(e.target.value)} required />

        <label>Option D</label>
        <input value={optionD} onChange={(e) => setOptionD(e.target.value)} required />

        <label>Correct Answer</label>
        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        >
          <option value="A">Option A</option>
          <option value="B">Option B</option>
          <option value="C">Option C</option>
          <option value="D">Option D</option>
        </select>

        <label>Marks</label>
        <input
          type="number"
          min={1}
          value={marks}
          onChange={(e) => setMarks(Number(e.target.value))}
        />

        <button type="submit" className="save-btn">Add Question</button>
      </form>
    </div>
  );
};

export default CreateQuestion;
