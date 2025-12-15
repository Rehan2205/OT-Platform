import React, { useEffect, useState } from "react";
import MCQForm from "./MCQForm";
import CodingForm from "./CodingForm";
import DescriptiveForm from "./DescriptiveForm";
import {
  MCQQuestion,
  CodingQuestion,
  DescriptiveQuestion,
  Difficulty,
} from "../../types";

export type Question = MCQQuestion | CodingQuestion | DescriptiveQuestion;

type Props = {
  qType: "mcq" | "coding" | "descriptive";
  setQType: (t: "mcq" | "coding" | "descriptive") => void;
  editingQuestion: Question | null;
  onSave: (q: Question) => void;
};

export default function QuestionForm({
  qType,
  setQType,
  editingQuestion,
  onSave,
}: Props) {
  const [text, setText] = useState("");
  const [marks, setMarks] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  useEffect(() => {
    if (!editingQuestion) {
      setText("");
      setMarks(1);
      setDifficulty("medium");
      return;
    }
    setText(editingQuestion.text);
    setMarks(editingQuestion.marks);
    setDifficulty(editingQuestion.difficulty);
  }, [editingQuestion]);

  const baseMCQ = {
    text,
    marks,
    difficulty,
    id: editingQuestion?.id || Date.now().toString(),
  };

  const baseCoding = {
    text,
    marks,
    difficulty,
    id: editingQuestion?.id || Date.now().toString(),
    language: editingQuestion && editingQuestion.type === "coding" ? editingQuestion.language : "javascript",
  };

  const baseDescriptive = {
    text,
    marks,
    difficulty,
    id: editingQuestion?.id || Date.now().toString(),
    rubric:
      editingQuestion && editingQuestion.type === "descriptive"
        ? editingQuestion.rubric
        : [],
    wordLimit:
      editingQuestion && editingQuestion.type === "descriptive"
        ? editingQuestion.wordLimit
        : undefined,
  };

  const isMCQ = (q: Question | null): q is MCQQuestion => q?.type === "mcq";
  const isCoding = (q: Question | null): q is CodingQuestion => q?.type === "coding";
  const isDescriptive = (q: Question | null): q is DescriptiveQuestion =>
    q?.type === "descriptive";

  return (
    <div className="form-card" style={{ marginTop: 20 }}>
      

      <label>Type of Question</label>
      <select
        value={qType}
        onChange={(e) => setQType(e.target.value as "mcq" | "coding" | "descriptive")}
      >
        <option value="mcq">MCQ</option>
        <option value="coding">Coding</option>
        <option value="descriptive">Descriptive</option>
      </select>

      <label>Question Text</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your question here..."
      />

      <label style={{ marginTop: 12 }}>Marks</label>
      <input
        type="number"
        value={marks}
        onChange={(e) => setMarks(Number(e.target.value))}
        min={1}
      />

      <label style={{ marginTop: 12 }}>Difficulty</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <div style={{ marginTop: 16 }}>
        {qType === "mcq" && (
          <MCQForm
            editing={isMCQ(editingQuestion) ? editingQuestion : null}
            onSave={onSave}
          />

        )}

        {qType === "coding" && (
          <CodingForm
            base={baseCoding}
            editing={isCoding(editingQuestion) ? editingQuestion : null}
            onSave={onSave}
          />
        )}

        {qType === "descriptive" && (
          <DescriptiveForm
            base={baseDescriptive}
            editing={isDescriptive(editingQuestion) ? editingQuestion : null}
            onSave={onSave}
          />
        )}
      </div>
    </div>
  );
}
