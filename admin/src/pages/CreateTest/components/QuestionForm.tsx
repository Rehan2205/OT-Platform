import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { Question, Difficulty, CodingTestCase } from "../types";

type Props = {
  qType: "mcq" | "coding" | "descriptive";
  setQType: (v: "mcq" | "coding" | "descriptive") => void;
  editingQuestion: Question | null;
  onSave: (q: Question) => void;
};

export default function QuestionForm({ qType, setQType, editingQuestion, onSave }: Props) {
  const [qText, setQText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [starterCode, setStarterCode] = useState("");
  const [testCases, setTestCases] = useState<CodingTestCase[]>([]);
  const [wordLimit, setWordLimit] = useState<number | undefined>();
  const [marks, setMarks] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!editingQuestion) return;
    setQText(editingQuestion.text);
    setMarks(editingQuestion.marks);
    setDifficulty(editingQuestion.difficulty);

    if (editingQuestion.type === "mcq") {
      setQType("mcq");
      setOptions(editingQuestion.options.slice());
      setCorrectIndex(editingQuestion.correctIndex ?? null);
    } else if (editingQuestion.type === "coding") {
      setQType("coding");
      setStarterCode(editingQuestion.starterCode || "");
      setTestCases(editingQuestion.testCases || []);
    } else {
      setQType("descriptive");
      setWordLimit(editingQuestion.wordLimit);
    }
  }, [editingQuestion]);

  const setOptionAt = (i: number, value: string) => {
    const next = [...options];
    next[i] = value;
    setOptions(next);
  };

  const addOption = () => { if (options.length < 6) setOptions([...options, ""]); };
  const removeOption = (i: number) => {
    if (options.length <= 2) return;
    const next = options.filter((_, idx) => idx !== i);
    setOptions(next);
    if (correctIndex === i) setCorrectIndex(null);
    else if (correctIndex !== null && correctIndex > i) setCorrectIndex(correctIndex - 1);
  };

  const addTestCase = () => setTestCases([...testCases, { input: "", output: "", hidden: false }]);
  const setTestCase = (idx: number, key: keyof CodingTestCase, val: any) => {
    const next = [...testCases];
    next[idx] = { ...next[idx], [key]: val };
    setTestCases(next);
  };
  const removeTestCase = (idx: number) => setTestCases(testCases.filter((_, i) => i !== idx));

  const validateQuestion = () => {
    const e: Record<string, string> = {};
    if (!qText.trim()) e.qText = "Question text is required.";
    if (!marks || marks <= 0) e.marks = "Marks must be > 0.";

    if (qType === "mcq") {
      if (options.length < 2) e.options = "At least 2 options required.";
      if (options.some((o) => !o.trim())) e.options = "All options must be filled.";
      if (correctIndex === null) e.correct = "Select the correct option.";
    }

    if (qType === "coding") {
      if (testCases.length === 0) e.testCases = "Add at least one test case.";
      testCases.forEach((tc, i) => {
        if (!tc.input.trim() || !tc.output.trim())
          e[`tc_${i}`] = "Input and Output required.";
      });
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validateQuestion()) {
      Object.values(errors).forEach((msg) => toast.error(msg));
      return;
    }

    const base = {
      id: editingQuestion?.id || uuid(),
      text: qText.trim(),
      marks,
      difficulty,
    };

    let q: Question;
    if (qType === "mcq") {
      q = { ...base, type: "mcq", options: options.map((o) => o.trim()), correctIndex };
    } else if (qType === "coding") {
      q = { ...base, type: "coding", starterCode, testCases: testCases.map(t => ({ ...t, hidden: !!t.hidden })) };
    } else {
      q = { ...base, type: "descriptive", wordLimit };
    }

    onSave(q);

    // Reset form
    setQText(""); setOptions(["",""]); setCorrectIndex(null);
    setStarterCode(""); setTestCases([]); setWordLimit(undefined);
    setMarks(1); setDifficulty("easy"); setErrors({});
  };

  return (
    <div>
      <h3>{editingQuestion ? "Edit Question" : "Add Question"}</h3>

      <label>Question Type</label>
      <select value={qType} onChange={(e) => setQType(e.target.value as any)}>
        <option value="mcq">MCQ</option>
        <option value="coding">Coding</option>
        <option value="descriptive">Descriptive</option>
      </select>

      <label>Question Text</label>
      <textarea
        className="large-qtext"
        value={qText}
        onChange={(e) => setQText(e.target.value)}
        placeholder="Enter question prompt..."
      />
      {errors.qText && <div className="error">{errors.qText}</div>}

      {qType === "mcq" && (
        <>
          <div className="options-container">
            {options.map((opt, i) => (
              <div className="option-row" key={i}>
                <input placeholder={`Option ${i+1}`} value={opt} onChange={(e) => setOptionAt(i, e.target.value)} />
                <label className="radio-label">
                  <input type="radio" name="correct" checked={correctIndex===i} onChange={() => setCorrectIndex(i)} />
                  Correct
                </label>
                {options.length>2 && <button type="button" className="small-btn" onClick={()=>removeOption(i)}>✖</button>}
              </div>
            ))}
          </div>
          {errors.options && <div className="error">{errors.options}</div>}
          {errors.correct && <div className="error">{errors.correct}</div>}
          <button type="button" className="add-btn" onClick={addOption}>+ Add Option</button>
        </>
      )}

      {qType==="coding" && (
        <>
          <h4>Test Cases</h4>
          {errors.testCases && <div className="error">{errors.testCases}</div>}
          {testCases.map((tc, idx) => (
            <div className="testcase-row" key={idx}>
              <input placeholder="Input" value={tc.input} onChange={e=>setTestCase(idx,'input',e.target.value)} />
              <input placeholder="Output" value={tc.output} onChange={e=>setTestCase(idx,'output',e.target.value)} />
              <label className="hidden-label">
                <input type="checkbox" checked={!!tc.hidden} onChange={e=>setTestCase(idx,'hidden',e.target.checked)} />
                hidden
              </label>
              <button type="button" className="small-btn" onClick={()=>removeTestCase(idx)}>✖</button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addTestCase}>+ Add Test Case</button>
        </>
      )}

      {qType==="descriptive" && (
        <>
          <label>Word Limit (optional)</label>
          <input type="number" value={wordLimit??""} onChange={e=>setWordLimit(e.target.value?Number(e.target.value):undefined)} placeholder="e.g. 200"/>
        </>
      )}

      <div className="q-settings">
        <label>Marks</label>
        <input type="number" value={marks} onChange={e=>setMarks(Number(e.target.value)||0)} style={{width:80}} />
        <label style={{marginLeft:12}}>Difficulty</label>
        <select value={difficulty} onChange={e=>setDifficulty(e.target.value as Difficulty)} className="difficulty-small">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        {errors.marks && <div className="error">{errors.marks}</div>}
      </div>

      <div style={{marginTop:22, display:"flex", gap:14}}>
        <button type="button" className="add-btn" onClick={handleSave}>
          {editingQuestion ? "Update Question" : "+ Add Question"}
        </button>
      </div>
    </div>
  );
}
