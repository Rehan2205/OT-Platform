import React from "react";

export type CodingTestCase = {
  input: string;
  output: string;
  hidden?: boolean;
};

type CodingFormProps = {
  testCases: CodingTestCase[];
  setTestCase: (idx: number, key: keyof CodingTestCase, val: any) => void;
  addTestCase: () => void;
  removeTestCase: (idx: number) => void;
  errors?: Record<string, string>;
  starterCode: string;
  setStarterCode: (val: string) => void;
};

const CodingForm: React.FC<CodingFormProps> = ({
  testCases,
  setTestCase,
  addTestCase,
  removeTestCase,
  errors,
  starterCode,
  setStarterCode,
}) => {
  return (
    <div>
      <label>Starter Code (optional)</label>
      <textarea
        className="large-qtext"
        value={starterCode}
        onChange={(e) => setStarterCode(e.target.value)}
        placeholder="Enter starter code if any..."
      />

      <h4>Test Cases</h4>
      {errors?.testCases && <div className="error">{errors.testCases}</div>}

      {testCases.map((tc, idx) => (
        <div className="testcase-row" key={idx}>
          <input
            placeholder="Input"
            value={tc.input}
            onChange={(e) => setTestCase(idx, "input", e.target.value)}
          />
          <input
            placeholder="Output"
            value={tc.output}
            onChange={(e) => setTestCase(idx, "output", e.target.value)}
          />
          <label className="hidden-label">
            <input
              type="checkbox"
              checked={!!tc.hidden}
              onChange={(e) => setTestCase(idx, "hidden", e.target.checked)}
            />
            hidden
          </label>
          <button type="button" className="small-btn" onClick={() => removeTestCase(idx)}>
            ✖
          </button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addTestCase}>
        + Add Test Case
      </button>
    </div>
  );
};

export default CodingForm;
