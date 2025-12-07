import React from "react";

type DescriptiveFormProps = {
  wordLimit?: number;
  setWordLimit: (val?: number) => void;
};

const DescriptiveForm: React.FC<DescriptiveFormProps> = ({ wordLimit, setWordLimit }) => {
  return (
    <div>
      <label>Word Limit (optional)</label>
      <input
        type="number"
        value={wordLimit ?? ""}
        onChange={(e) => setWordLimit(e.target.value ? Number(e.target.value) : undefined)}
        placeholder="e.g. 200"
      />
    </div>
  );
};

export default DescriptiveForm;
