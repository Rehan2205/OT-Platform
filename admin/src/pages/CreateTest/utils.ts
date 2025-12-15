import { Question } from "./types";

export function validateFullTest(
  title: string,
  duration: number,
  totalMarks: number,
  questions: Question[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!title.trim()) errors.title = "Test title is required";
  if (duration <= 0) errors.duration = "Duration must be greater than 0";
  if (questions.length === 0)
    errors.questions = "At least one question is required";

  if (totalMarks > 0) {
    const sum = questions.reduce((s, q) => s + q.marks, 0);
    if (sum !== totalMarks)
      errors.totalMarks = "Sum of question marks must equal total marks";
  }

  return errors;
}

export function moveQuestion(
  list: Question[],
  from: number,
  to: number
): Question[] {
  const updated = [...list];
  const [item] = updated.splice(from, 1);
  updated.splice(to, 0, item);
  return updated;
}

export function validateQuestion(q: Question): string | null {
  if (!q.text.trim()) return "Question text is required";

  if (q.type === "mcq") {
    if (q.options.length < 2) return "At least 2 options required";
    if (q.correctIndex === null) return "Select correct option";
  }

  if (q.type === "coding" && q.testCases.length === 0) {
    return "Add at least one test case";
  }

  return null;
}
