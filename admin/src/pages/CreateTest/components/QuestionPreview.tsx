import React from "react";
import { Question } from "../types";

type Props = {
  q: Question;
  idx: number;
};

export default function QuestionPreview({ q, idx }: Props) {
  if (q.type === "mcq") {
    return (
      <div key={q.id} className="preview-question">
        <div>
          <strong>
            {idx + 1}. {q.text}
          </strong>
        </div>
        <ul>
          {q.options.map((opt, i) => (
            <li
              key={i}
              style={{
                color: q.correctIndex === i ? "green" : undefined,
                fontWeight: q.correctIndex === i ? 700 : 400,
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
        <div>Marks: {q.marks} • Difficulty: {q.difficulty}</div>
      </div>
    );
  }

  if (q.type === "coding") {
    return (
      <div key={q.id} className="preview-question">
        <div>
          <strong>
            {idx + 1}. {q.text}
          </strong>
        </div>
        <div>Starter code: {q.starterCode ? "Yes" : "No"}</div>
        <div>Testcases: {q.testCases.length}</div>
        <div>Marks: {q.marks} • Difficulty: {q.difficulty}</div>
      </div>
    );
  }

  return (
    <div key={q.id} className="preview-question">
      <div>
        <strong>
          {idx + 1}. {q.text}
        </strong>
      </div>
      <div>Word limit: {q.wordLimit ?? "none"}</div>
      <div>Marks: {q.marks} • Difficulty: {q.difficulty}</div>
    </div>
  );
}
