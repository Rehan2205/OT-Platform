import React, { useEffect, useState } from "react";
import { DescriptiveQuestion, RubricItem } from "../../types";

type Props = {
  base: Omit<DescriptiveQuestion, "type" | "rubric">;
  editing: DescriptiveQuestion | null;
  onSave: (q: DescriptiveQuestion) => void;
};

export default function DescriptiveForm({ base, editing, onSave }: Props) {
  const [wordLimit, setWordLimit] = useState<number | undefined>(undefined);
  const [rubric, setRubric] = useState<RubricItem[]>([]);

  useEffect(() => {
    if (!editing) return;
    setWordLimit(editing.wordLimit);
    setRubric(editing.rubric || []);
  }, [editing]);

  const setRubricItem = (idx: number, field: keyof RubricItem, value: string | number) => {
    const next = [...rubric];
    next[idx] = { ...next[idx], [field]: value };
    setRubric(next);
  };

  return (
    <>
      <label>Word Limit (optional)</label>
      <input
        type="number"
        value={wordLimit ?? ""}
        onChange={(e) => setWordLimit(e.target.value ? Number(e.target.value) : undefined)}
      />

      <h4 className="section-title">Evaluation Rubric</h4>
      {rubric.map((r, idx) => (
        <div className="option-row" key={idx}>
          <input
            type="text"
            placeholder="Criteria"
            value={r.criteria}
            onChange={(e) => setRubricItem(idx, "criteria", e.target.value)}
          />
          <input
            type="number"
            placeholder="Marks"
            value={r.marks}
            onChange={(e) => setRubricItem(idx, "marks", Number(e.target.value))}
            style={{ width: 90 }}
          />
          <button className="small-btn" onClick={() => setRubric(rubric.filter((_, i) => i !== idx))}>
            &times;
          </button>
        </div>
      ))}

      <button className="add-btn" onClick={() => setRubric([...rubric, { criteria: "", marks: 1 }])}>
        + Add Rubric
      </button>

      <button
        className="add-btn"
        onClick={() =>
          onSave({
            ...base,
            type: "descriptive",
            wordLimit,
            rubric: rubric.length ? rubric : undefined,
          })
        }
      >
        Save Question
      </button>
    </>
  );
}
