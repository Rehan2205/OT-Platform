import React from "react";

type Props = {
  title: string;
  setTitle: (v: string) => void;
  duration: number;
  setDuration: (v: number) => void;
  totalMarks: number;
  setTotalMarks: (v: number) => void;
  errors: Record<string, string>;
};

export default function TestInfoForm({ title, setTitle, duration, setDuration, totalMarks, setTotalMarks, errors }: Props) {
  return (
    <>
      {errors.form && <div className="error">{errors.form}</div>}

      <label>Title</label>
      <input
        className="test-title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Test title"
      />
      {errors.title && <div className="error">{errors.title}</div>}

      <label>Duration (minutes)</label>
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value) || 0)}
      />
      {errors.duration && <div className="error">{errors.duration}</div>}

      <label>Total Marks (optional)</label>
      <input
        type="number"
        value={totalMarks}
        onChange={(e) => setTotalMarks(Number(e.target.value) || 0)}
      />
      {errors.totalMarks && <div className="error">{errors.totalMarks}</div>}

      <hr />
    </>
  );
}
