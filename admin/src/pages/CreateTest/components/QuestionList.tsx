import React from "react";
import { Question } from "../types";
import { moveQuestion } from "../utils";

type Props = {
  questions: Question[];
  setQuestions: (q: Question[]) => void;
  onEdit: (i: number) => void;
  onDelete: (i: number) => void;
};

export default function QuestionList({ questions, setQuestions, onEdit, onDelete }: Props) {
  const handleMove = (from: number, to: number) => setQuestions(moveQuestion(questions, from, to));

  return (
    <div className="questions-list">
      {questions.map((q, i) => (
        <div key={q.id} className="question-item">
          <div className="drag-area">
            <button disabled={i === 0} onClick={() => handleMove(i, i - 1)}>↑</button>
            <button disabled={i === questions.length - 1} onClick={() => handleMove(i, i + 1)}>↓</button>
          </div>

          <p><strong>{i + 1}. {q.text}</strong></p>

          {q.type === "mcq" && (
            <ul>
              {q.options.map((o, idx) => (
                <li key={idx} style={{
                  color: q.correctIndex === idx ? "green" : undefined,
                  fontWeight: q.correctIndex === idx ? 700 : 400,
                }}>{o}</li>
              ))}
            </ul>
          )}

          {q.type === "coding" && <div>Testcases: {q.testCases.length}</div>}
          {q.type === "descriptive" && <div>Word limit: {q.wordLimit ?? "N/A"}</div>}

          <div style={{ marginTop: 8 }}>
            <button className="edit-btn" onClick={() => onEdit(i)}>Edit</button>
            <button className="delete-btn" onClick={() => onDelete(i)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
