import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TestInfoForm from "./components/TestInfoForm";
import QuestionForm from "./components/QuestionForm/QuestionForm";
import QuestionList from "./components/QuestionList";
import TestPreviewModal from "./components/TestPreviewModal";

import { Question } from "./types";
import { validateQuestion, validateFullTest } from "./utils";

import "./CreateTest.css";

const DRAFT_KEY = "testDraft";

export default function CreateTest() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [totalMarks, setTotalMarks] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [qType, setQType] = useState<"mcq" | "coding" | "descriptive">("mcq");
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors] = useState<Record<string, string>>({});

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;

    try {
      const draft = JSON.parse(raw);
      setTitle(draft.title || "");
      setDuration(draft.duration || 60);
      setTotalMarks(draft.totalMarks || 0);
      setQuestions(draft.questions || []);
    } catch {
      console.warn("Failed to load draft");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ title, duration, totalMarks, questions })
    );
  }, [title, duration, totalMarks, questions]);

  useEffect(() => {
    const sum = questions.reduce((acc, q) => acc + q.marks, 0);
    setTotalMarks(sum);
  }, [questions]);

  const handleSaveQuestion = (q: Question) => {
    const error = validateQuestion(q);
    if (error) {
      toast.error(error);
      return;
    }

    if (editingIndex !== null) {
      const next = [...questions];
      next[editingIndex] = q;
      setQuestions(next);
      setEditingIndex(null);
    } else {
      setQuestions((prev) => [...prev, q]);
    }
  };

  const handleEditQuestion = (index: number) => {
    setEditingIndex(index);
  };

  const handleDeleteQuestion = (index: number) => {
    if (!window.confirm("Delete this question?")) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateTest = async () => {
    const validationErrors = validateFullTest(
      title,
      duration,
      totalMarks,
      questions
    );

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((msg) => toast.error(msg));
      return;
    }

    const payload = {
      title: title.trim(),
      duration,
      totalMarks,
      questions,
    };

    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");

      await axios.post("/tests", payload, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });

      localStorage.removeItem(DRAFT_KEY);
      toast.success("Test created successfully!");
      window.location.reload();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Failed to create test"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-test-container">
      <h1 className="page-title">Create Test</h1>

      <div className="form-card">
        {/* TEST INFO */}
        <h3 className="section-title">Test Information</h3>
        <TestInfoForm
          title={title}
          setTitle={setTitle}
          duration={duration}
          setDuration={setDuration}
          totalMarks={totalMarks}
          setTotalMarks={setTotalMarks}
          errors={errors}
        />

        {/* ADD QUESTION */}
        <h3 className="section-title">Add Question</h3>
        <QuestionForm
          qType={qType}
          setQType={setQType}
          editingQuestion={
            editingIndex !== null ? questions[editingIndex] : null
          }
          onSave={handleSaveQuestion}
        />

        {/* QUESTIONS LIST */}
        <h3 className="section-title">Questions</h3>
        <QuestionList
          questions={questions}
          setQuestions={setQuestions}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
        />
      </div>

      {/* STICKY FOOTER */}
      <div className="sticky-footer">
        <button
          className="preview-btn"
          type="button"
          onClick={() => setShowPreview(true)}
        >
          Preview Test
        </button>

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
            if (window.confirm("Clear draft and reset?")) {
              localStorage.removeItem(DRAFT_KEY);
              window.location.reload();
            }
          }}
        >
          Reset Builder
        </button>
      </div>

      {/* PREVIEW MODAL */}
      {showPreview && (
        <TestPreviewModal
          title={title}
          duration={duration}
          totalMarks={totalMarks}
          questions={questions}
          onClose={() => setShowPreview(false)}
          onCreate={() => {
            setShowPreview(false);
            handleCreateTest();
          }}
        />
      )}

      <ToastContainer position="top-right" theme="colored" />
    </div>
  );
}
