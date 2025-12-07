import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./CreateTest.css";
import { v4 as uuid } from "uuid";

type Difficulty = "easy" | "medium" | "hard";

type MCQQuestion = {
  id: string;
  type: "mcq";
  text: string;
  options: string[];
  correctIndex: number | null;
  marks: number;
  difficulty: Difficulty;
};

type CodingTestCase = { input: string; output: string; hidden?: boolean };

type CodingQuestion = {
  id: string;
  type: "coding";
  text: string;
  starterCode?: string;
  testCases: CodingTestCase[];
  marks: number;
  difficulty: Difficulty;
};

type DescriptiveQuestion = {
  id: string;
  type: "descriptive";
  text: string;
  wordLimit?: number;
  marks: number;
  difficulty: Difficulty;
};

type Question = MCQQuestion | CodingQuestion | DescriptiveQuestion;

export default function CreateTest() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<number>(60);
  const [totalMarks, setTotalMarks] = useState<number>(0);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [qType, setQType] = useState<"mcq" | "coding" | "descriptive">("mcq");
  const [qText, setQText] = useState("");

  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);

  const [starterCode, setStarterCode] = useState(""); // kept for backend compatibility
  const [testCases, setTestCases] = useState<CodingTestCase[]>([]);

  const [wordLimit, setWordLimit] = useState<number | undefined>(undefined);

  const [marks, setMarks] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const DRAFT_KEY = "testDraft";

  // Load Draft
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      setTitle(draft.title || "");
      setDuration(draft.duration || 60);
      setTotalMarks(draft.totalMarks || 0);
      setQuestions(draft.questions || []);
    } catch {}
  }, []);

  // Auto-save Draft
  useEffect(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        title,
        duration,
        totalMarks,
        questions,
      })
    );
  }, [title, duration, totalMarks, questions]);

  const setOptionAt = (i: number, value: string) => {
    const next = [...options];
    next[i] = value;
    setOptions(next);
  };

  const addOption = () => {
    if (options.length >= 6) return;
    setOptions([...options, ""]);
  };

  const removeOption = (i: number) => {
    if (options.length <= 2) return;
    const next = options.filter((_, idx) => idx !== i);
    setOptions(next);

    if (correctIndex === i) setCorrectIndex(null);
    else if (correctIndex !== null && correctIndex > i)
      setCorrectIndex(correctIndex - 1);
  };

  const addTestCase = () =>
    setTestCases([...testCases, { input: "", output: "", hidden: false }]);

  const setTestCase = (idx: number, key: keyof CodingTestCase, val: any) => {
    const next = [...testCases];
    next[idx] = { ...next[idx], [key]: val };
    setTestCases(next);
  };

  const removeTestCase = (idx: number) =>
    setTestCases(testCases.filter((_, i) => i !== idx));

  function validateQuestion(): boolean {
    const e: Record<string, string> = {};

    if (!qText.trim()) e.qText = "Question text is required.";
    if (!marks || marks <= 0) e.marks = "Marks must be > 0.";

    if (qType === "mcq") {
      if (options.length < 2) e.options = "At least 2 options required.";
      if (options.some((o) => !o.trim()))
        e.options = "All options must be filled.";
      if (correctIndex === null)
        e.correct = "Select the correct option.";
    }

    if (qType === "coding") {
      if (testCases.length === 0)
        e.testCases = "Add at least one test case.";
      testCases.forEach((tc, i) => {
        if (!tc.input.trim() || !tc.output.trim())
          e[`tc_${i}`] = "Input and Output required.";
      });
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleAddOrUpdateQuestion() {
    if (!validateQuestion()) return;

    const base = {
      id:
        editingIndex !== null && questions[editingIndex]
          ? questions[editingIndex].id
          : uuid(),
      text: qText.trim(),
      marks,
      difficulty,
    };

    let q: Question;

    if (qType === "mcq") {
      q = {
        ...(base as any),
        type: "mcq",
        options: options.map((o) => o.trim()),
        correctIndex,
      };
    } else if (qType === "coding") {
      q = {
        ...(base as any),
        type: "coding",
        starterCode: starterCode, // kept for backend
        testCases: testCases.map((t) => ({
          input: t.input,
          output: t.output,
          hidden: !!t.hidden,
        })),
      };
    } else {
      q = {
        ...(base as any),
        type: "descriptive",
        wordLimit,
      };
    }

    if (editingIndex !== null) {
      const next = [...questions];
      next[editingIndex] = q;
      setQuestions(next);
      setEditingIndex(null);
    } else {
      setQuestions((s) => [...s, q]);
    }

    setQText("");
    setOptions(["", ""]);
    setCorrectIndex(null);
    setStarterCode("");
    setTestCases([]);
    setWordLimit(undefined);
    setMarks(1);
    setDifficulty("easy");
    setErrors({});
  }

  function handleEditQuestion(i: number) {
    const q = questions[i];
    setEditingIndex(i);
    setQText(q.text);
    setMarks(q.marks);
    setDifficulty(q.difficulty);

    if (q.type === "mcq") {
      setQType("mcq");
      setOptions(q.options.slice());
      setCorrectIndex(q.correctIndex ?? null);
    } else if (q.type === "coding") {
      setQType("coding");
      setStarterCode(q.starterCode || "");
      setTestCases(q.testCases || []);
    } else {
      setQType("descriptive");
      setWordLimit(q.wordLimit);
    }
  }

  function handleDeleteQuestion(i: number) {
    if (!window.confirm("Delete this question?")) return;
    setQuestions(questions.filter((_, idx) => idx !== i));
  }

  function moveQuestion(from: number, to: number) {
    if (to < 0 || to >= questions.length) return;
    const next = [...questions];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setQuestions(next);
  }

  function renderPreviewQuestion(q: Question, idx: number) {
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
          <div>
            Marks: {q.marks} • Difficulty: {q.difficulty}
          </div>
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
          <div>
            Marks: {q.marks} • Difficulty: {q.difficulty}
          </div>
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
        <div>
          Marks: {q.marks} • Difficulty: {q.difficulty}
        </div>
      </div>
    );
  }

  async function handleCreateTest() {
    if (!title.trim()) {
      setErrors({ form: "Title is required" });
      return;
    }
    if (questions.length === 0) {
      setErrors({ form: "Add at least one question" });
      return;
    }

    const payload = {
      title: title.trim(),
      durationMinutes: duration,
      totalMarks:
        totalMarks || questions.reduce((s, q) => s + (q.marks || 0), 0),
      questions,
    };

    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post("/tests", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      localStorage.removeItem(DRAFT_KEY);
      alert("Test created successfully.");
      window.location.reload();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to create test");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="create-test-container">
      <h1 className="page-title">Create Test</h1>

      <div className="form-card">
        {errors.form && <div className="error">{errors.form}</div>}

        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Test title"
        />

        <label>Duration (minutes)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) =>
            setDuration(Number(e.target.value) || 0)
          }
        />

        <label>Total Marks (optional)</label>
        <input
          type="number"
          value={totalMarks}
          onChange={(e) =>
            setTotalMarks(Number(e.target.value) || 0)
          }
        />

        <hr />

        <h3 className="section-title">
          {editingIndex !== null ? "Edit Question" : "Add Question"}
        </h3>

        <label>Question Type</label>
        <select
          value={qType}
          onChange={(e) => setQType(e.target.value as any)}
        >
          <option value="mcq">MCQ</option>
          <option value="coding">Coding</option>
          <option value="descriptive">Descriptive</option>
        </select>

        {/* BIGGER QUESTION TEXT AREA */}
        <label>Question Text</label>
        <textarea
          className="large-qtext"
          value={qText}
          onChange={(e) => setQText(e.target.value)}
          placeholder="Enter question prompt..."
        />
        {errors.qText && (
          <div className="error">{errors.qText}</div>
        )}

        {/* MCQ UI */}
        {qType === "mcq" && (
          <>
            <div className="options-container">
              {options.map((opt, i) => (
                <div className="option-row" key={i}>
                  <input
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) =>
                      setOptionAt(i, e.target.value)
                    }
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
                    <button
                      type="button"
                      className="small-btn"
                      onClick={() => removeOption(i)}
                    >
                      ✖
                    </button>
                  )}
                </div>
              ))}
            </div>

            {errors.options && (
              <div className="error">{errors.options}</div>
            )}
            {errors.correct && (
              <div className="error">{errors.correct}</div>
            )}

            <button
              type="button"
              className="add-btn"
              onClick={addOption}
            >
              + Add Option
            </button>
          </>
        )}

        {/* CODING UI — Starter Code Removed Visually */}
        {qType === "coding" && (
          <>
            <h4>Test Cases</h4>
            {errors.testCases && (
              <div className="error">{errors.testCases}</div>
            )}

            {testCases.map((tc, idx) => (
              <div className="testcase-row" key={idx}>
                <input
                  placeholder="Input"
                  value={tc.input}
                  onChange={(e) =>
                    setTestCase(idx, "input", e.target.value)
                  }
                />
                <input
                  placeholder="Output"
                  value={tc.output}
                  onChange={(e) =>
                    setTestCase(idx, "output", e.target.value)
                  }
                />
                <label className="hidden-label">
                  <input
                    type="checkbox"
                    checked={!!tc.hidden}
                    onChange={(e) =>
                      setTestCase(idx, "hidden", e.target.checked)
                    }
                  />
                  hidden
                </label>
                <button
                  type="button"
                  className="small-btn"
                  onClick={() => removeTestCase(idx)}
                >
                  ✖
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-btn"
              onClick={addTestCase}
            >
              + Add Test Case
            </button>
          </>
        )}

        {/* DESCRIPTIVE UI */}
        {qType === "descriptive" && (
          <>
            <label>Word Limit (optional)</label>
            <input
              type="number"
              value={wordLimit ?? ""}
              onChange={(e) =>
                setWordLimit(
                  e.target.value
                    ? Number(e.target.value)
                    : undefined
                )
              }
              placeholder="e.g. 200"
            />
          </>
        )}

        <div className="q-settings">
          <label>Marks</label>
          <input
            type="number"
            value={marks}
            onChange={(e) =>
              setMarks(Number(e.target.value) || 0)
            }
            style={{ width: 80 }}
          />

          <label style={{ marginLeft: 12 }}>Difficulty</label>

          {/* SAME WIDTH AS MARKS SECTION */}
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as Difficulty)
            }
            className="difficulty-small"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {errors.marks && (
            <div className="error">{errors.marks}</div>
          )}
        </div>

        {/* More gap between buttons */}
        <div style={{ marginTop: 22, display: "flex", gap: 14 }}>
          <button
            type="button"
            className="add-btn"
            onClick={handleAddOrUpdateQuestion}
          >
            {editingIndex !== null
              ? "Update Question"
              : "+ Add Question"}
          </button>

          <button
            type="button"
            className="preview-btn"
            onClick={() => setShowPreview(true)}
          >
            Preview Test
          </button>
        </div>

        {/* Question List */}
        <div className="questions-list">
          {questions.map((q, i) => (
            <div key={q.id} className="question-item">
              <div className="drag-area">
                <button
                  disabled={i === 0}
                  onClick={() => moveQuestion(i, i - 1)}
                >
                  ↑
                </button>
                <button
                  disabled={i === questions.length - 1}
                  onClick={() => moveQuestion(i, i + 1)}
                >
                  ↓
                </button>
              </div>

              <p>
                <strong>
                  {i + 1}. {q.text}
                </strong>
              </p>

              {q.type === "mcq" && (
                <ul>
                  {q.options.map((o, idx) => (
                    <li
                      key={idx}
                      style={{
                        color:
                          q.correctIndex === idx ? "green" : undefined,
                        fontWeight:
                          q.correctIndex === idx ? 700 : 400,
                      }}
                    >
                      {o}
                    </li>
                  ))}
                </ul>
              )}

              {q.type === "coding" && (
                <div>Testcases: {q.testCases.length}</div>
              )}

              {q.type === "descriptive" && (
                <div>Word limit: {q.wordLimit ?? "N/A"}</div>
              )}

              <div style={{ marginTop: 8 }}>
                <button
                  className="edit-btn"
                  onClick={() => handleEditQuestion(i)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteQuestion(i)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{ marginTop: 18, display: "flex", gap: 12 }}
        >
          <button
            className="create-btn"
            onClick={handleCreateTest}
            disabled={saving}
          >
            {saving ? "Saving..." : "Create Test"}
          </button>

          <button
            className="delete-btn"
            onClick={() => {
              if (
                window.confirm("Clear draft and reset?")
              ) {
                localStorage.removeItem(DRAFT_KEY);
                window.location.reload();
              }
            }}
          >
            Reset Builder
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="modal-overlay"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ONLY ONE CLOSE BUTTON NOW */}
            <button
              className="close-btn"
              onClick={() => setShowPreview(false)}
            >
              Close
            </button>

            <h2 className="modal-title">Preview Test</h2>

            <p>
              <b>Title:</b> {title}
            </p>
            <p>
              <b>Duration:</b> {duration} minutes
            </p>
            <p>
              <b>Total Marks:</b>
              {totalMarks ||
                questions.reduce(
                  (s, q) => s + q.marks,
                  0
                )}
            </p>

            <div style={{ marginTop: 12 }}>
              {questions.map((q, idx) =>
                renderPreviewQuestion(q, idx)
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              <button
                className="add-btn"
                onClick={() => {
                  setShowPreview(false);
                  handleCreateTest();
                }}
              >
                Create Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
