import React, { useEffect, useState } from "react";
import { CodingQuestion, CodingTestCase, CodingLanguage } from "../../types";

type Props = {
  base: Omit<CodingQuestion, "type" | "testCases">;
  editing: CodingQuestion | null;
  onSave: (q: CodingQuestion) => void;
};

export default function CodingForm({ base, editing, onSave }: Props) {
  const [testCases, setTestCases] = useState<CodingTestCase[]>([
    { input: "", output: "" },
  ]);
  const [starterCode, setStarterCode] = useState("");
  const [language, setLanguage] = useState<CodingLanguage>("c++");

  useEffect(() => {
    if (!editing) return;
    setTestCases(editing.testCases.length ? editing.testCases : [{ input: "", output: "" }]);
    setStarterCode(editing.starterCode || "");
    setLanguage(editing.language || "cpp");
  }, [editing]);

  const updateTestCase = (index: number, field: "input" | "output", value: string) => {
    const next = [...testCases];
    next[index] = { ...next[index], [field]: value };
    setTestCases(next);
  };

  return (
    <>
      <label>Programming Language</label>
      <select value={language} onChange={(e) => setLanguage(e.target.value as CodingLanguage)}>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
      </select>

      <label>Starter Code</label>
      <textarea
        className="code-editor"
        placeholder="// Starter code here"
        value={starterCode}
        onChange={(e) => setStarterCode(e.target.value)}
      />

      <h4 className="section-title">Test Cases</h4>
      {testCases.map((tc, i) => (
        <div className="testcase-row" key={i}>
          <input
            type="text"
            placeholder="Input"
            value={tc.input}
            onChange={(e) => updateTestCase(i, "input", e.target.value)}
          />
          <input
            type="text"
            placeholder="Expected Output"
            value={tc.output}
            onChange={(e) => updateTestCase(i, "output", e.target.value)}
          />
          <button className="small-btn" onClick={() => setTestCases(testCases.filter((_, idx) => idx !== i))}>
            &times;
          </button>
        </div>
      ))}

      <button className="add-btn" onClick={() => setTestCases([...testCases, { input: "", output: "" }])}>
        + Add Test Case
      </button>

      <button
        className="add-btn"
        onClick={() =>
          onSave({
            ...base,
            type: "coding",
            language,
            starterCode,
            testCases,
          })
        }
      >
        Save Question
      </button>
    </>
  );
}
