import React from "react";

type MCQFormProps = {
  options: string[];
  correctIndex: number | null;
  setOptionAt: (i: number, val: string) => void;
  setCorrectIndex: (i: number) => void;
  addOption: () => void;
  removeOption: (i: number) => void;
  errors?: Record<string, string>;
};

const MCQForm: React.FC<MCQFormProps> = ({
  options,
  correctIndex,
  setOptionAt,
  setCorrectIndex,
  addOption,
  removeOption,
  errors,
}) => {
  return (
    <div>
      <div className="options-container">
        {options.map((opt, i) => (
          <div className="option-row" key={i}>
            <input
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => setOptionAt(i, e.target.value)}
            />
            <label className="radio-label">
              <input
                type="radio"
                name="correct"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
              />
              Correct
            </label>
            {options.length > 2 && (
              <button type="button" className="small-btn" onClick={() => removeOption(i)}>
                ✖
              </button>
            )}
          </div>
        ))}
      </div>
      {errors?.options && <div className="error">{errors.options}</div>}
      {errors?.correct && <div className="error">{errors.correct}</div>}
      <button type="button" className="add-btn" onClick={addOption}>
        + Add Option
      </button>
    </div>
  );
};

export default MCQForm;
