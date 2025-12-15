export type Difficulty = "easy" | "medium" | "hard";

export type CodingLanguage = "javascript" | "python" | "java" | "c++";

export type BaseQuestion = {
  id: string;
  text: string;
  marks: number;
  difficulty: Difficulty;
};

// Coding question
export type CodingTestCase = {
  input: string;
  output: string;
};

export type CodingQuestion = BaseQuestion & {
  type: "coding";
  language: CodingLanguage;
  starterCode?: string;
  testCases: CodingTestCase[];
};

// MCQ question
export type MCQQuestion = BaseQuestion & {
  type: "mcq";
  options: string[];
  correctIndex: number | null;
};

// Descriptive question
export type RubricItem = { criteria: string; marks: number };

export type DescriptiveQuestion = BaseQuestion & {
  type: "descriptive";
  wordLimit?: number;      // Added this
  rubric?: RubricItem[];
};

// Union type for any question
export type Question = MCQQuestion | CodingQuestion | DescriptiveQuestion;
