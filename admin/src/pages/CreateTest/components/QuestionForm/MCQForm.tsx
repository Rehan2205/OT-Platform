import React, { useEffect, useState } from "react";
import { MCQQuestion, Difficulty } from "../../types";

type Props = {
  editing: MCQQuestion | null;
  onSave: (q: MCQQuestion) => void;
};

export default function MCQForm({ editing, onSave }: Props) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [marks, setMarks] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [error, setError] = useState("");

  // Load editing question
  useEffect(() => {
    if (!editing) return;

    setText(editing.text);
    setOptions(editing.options);
    setCorrectIndex(editing.correctIndex);
    setMarks(editing.marks);
    setDifficulty(editing.difficulty);
  }, [editing]);

  const deleteOption = (index: number) => {
    if (options.length <= 2) return;

    const next = options.filter((_, i) => i !== index);
    setOptions(next);

    if (correctIndex === index) setCorrectIndex(null);
    else if (correctIndex !== null && correctIndex > index)
      setCorrectIndex(correctIndex - 1);
  };

  const saveMCQ = () => {
    if (!text.trim()) {
      setError("Question text is required");
      return;
    }
    if (options.some((o) => !o.trim())) {
      setError("All options must be filled");
      return;
    }
    if (correctIndex === null) {
      setError("Select the correct option");
      return;
    }

    setError("");

    onSave({
      id: editing?.id || crypto.randomUUID(),
      type: "mcq",
      text,
      options,
      correctIndex,
      marks,
      difficulty,
    });
  };

  return (
    <>
      <label>Question</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter MCQ question"
      />

      <label>Marks</label>
      <input
        type="number"
        min={1}
        value={marks}
        onChange={(e) => setMarks(Number(e.target.value) || 1)}
      />

      <label>Difficulty</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <h4>Options</h4>

      {options.map((opt, i) => (
        <div className="option-row" key={i}>
          <input
            className="option-input"
            value={opt}
            placeholder={`Option ${i + 1}`}
            onChange={(e) => {
              const next = [...options];
              next[i] = e.target.value;
              setOptions(next);
            }}
          />

          <input
            type="radio"
            checked={correctIndex === i}
            onChange={() => setCorrectIndex(i)}
          />

          <button
            className="delete-btn"
            disabled={options.length <= 2}
            onClick={() => deleteOption(i)}
          >
            ✕
          </button>
        </div>
      ))}

      {error && <div className="error">{error}</div>}

      <button className="add-btn" onClick={() => setOptions([...options, ""])}>
        + Add Option
      </button>

      <button className="primary-btn" onClick={saveMCQ}>
        {editing ? "Update Question" : "Save Question"}
      </button>
    </>
  );
}
