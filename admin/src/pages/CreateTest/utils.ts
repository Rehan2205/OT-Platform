import { Question } from "./types";

// Move question up/down
export const moveQuestion = (questions: Question[], from: number, to: number) => {
  if (to < 0 || to >= questions.length) return questions;
  const next = [...questions];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

// Validate full test
export const validateFullTest = (
  title: string,
  duration: number,
  totalMarks: number,
  questions: Question[]
) => {
  const errors: Record<string, string> = {};

  if (!title.trim()) errors.title = "Test title is required.";
  if (!duration || duration <= 0) errors.duration = "Duration must be greater than 0.";
  if (questions.length === 0) errors.questions = "Add at least one question to create the test.";

  const calculatedMarks = questions.reduce((s, q) => s + (q.marks || 0), 0);
  if (totalMarks > 0 && calculatedMarks !== totalMarks) {
    errors.totalMarks = `Total marks mismatch. You set ${totalMarks}, but questions add up to ${calculatedMarks}.`;
  }

  questions.forEach((q, idx) => {
    if (!q.text.trim()) errors[`q_${idx}`] = `Question ${idx + 1} has empty text.`;
    if (q.marks <= 0) errors[`q_${idx}_marks`] = `Marks for question ${idx + 1} should be > 0.`;

    if (q.type === "mcq") {
      if (q.options.length < 2) errors[`q_${idx}_opt`] = `Question ${idx + 1} must have at least 2 options.`;
      if (q.options.some((o) => !o.trim()))
        errors[`q_${idx}_opt_empty`] = `Question ${idx + 1} has empty options.`;
      if (q.correctIndex === null)
        errors[`q_${idx}_correct`] = `Question ${idx + 1} must have a correct option selected.`;
    }

    if (q.type === "coding") {
      if (q.testCases.length === 0) errors[`q_${idx}_tc`] = `Coding question ${idx + 1} must have at least one test case.`;
      q.testCases.forEach((tc, tdx) => {
        if (!tc.input.trim() || !tc.output.trim())
          errors[`q_${idx}_tc_${tdx}`] = `Coding question ${idx + 1} test case ${tdx + 1} has empty input/output.`;
      });
    }
  });

  return errors;
};
