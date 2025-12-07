import React from "react";
import { Question } from "../types";
import QuestionPreview from "./QuestionPreview";

type Props = {
  title: string;
  duration: number;
  totalMarks: number;
  questions: Question[];
  onClose: () => void;
  onCreate: () => void;
};

export default function TestPreviewModal({ title, duration, totalMarks, questions, onClose, onCreate }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>

        <h2 className="modal-title">Preview Test</h2>

        <p><b>Title:</b> {title}</p>
        <p><b>Duration:</b> {duration} minutes</p>
        <p><b>Total Marks:</b> {totalMarks}</p>

        <div style={{ marginTop: 12 }}>
          {questions.map((q, idx) => (
            <QuestionPreview key={q.id} q={q} idx={idx} />
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="add-btn" onClick={onCreate}>
            Create Test
          </button>
        </div>
      </div>
    </div>
  );
}
