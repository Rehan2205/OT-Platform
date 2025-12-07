export type Difficulty = "easy" | "medium" | "hard";

export type MCQQuestion = {
  id: string;
  type: "mcq";
  text: string;
  options: string[];
  correctIndex: number | null;
  marks: number;
  difficulty: Difficulty;
};

export type CodingTestCase = { input: string; output: string; hidden?: boolean };

export type CodingQuestion = {
  id: string;
  type: "coding";
  text: string;
  starterCode?: string;
  testCases: CodingTestCase[];
  marks: number;
  difficulty: Difficulty;
};

export type DescriptiveQuestion = {
  id: string;
  type: "descriptive";
  text: string;
  wordLimit?: number;
  marks: number;
  difficulty: Difficulty;
};

export type Question = MCQQuestion | CodingQuestion | DescriptiveQuestion;
