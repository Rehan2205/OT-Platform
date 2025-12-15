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

export default function TestInfoForm({
  title,
  setTitle,
  duration,
  setDuration,
  totalMarks,
  setTotalMarks,
  errors,
}: Props) {
  return (
    <>
      {/* Title */}
      <label>Title</label>
      <input
        className="test-title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Test title"
      />
      {errors.title && <div className="error">{errors.title}</div>}

      <input type="number" value={totalMarks} disabled />

      {/* Duration */}
      <label>Duration (minutes)</label>
      <input
        type="number"
        min={1}
        value={duration}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val > 0) setDuration(val);
        }}
        placeholder="e.g. 60"
      />
      {errors.duration && <div className="error">{errors.duration}</div>}

      {/* Total Marks */}
      <label>Total Marks</label>
      <input type="number" value={totalMarks} disabled />

      {errors.totalMarks && <div className="error">{errors.totalMarks}</div>}
    </>
  );
}
