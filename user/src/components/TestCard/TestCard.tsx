import React from 'react';
import './TestCard.css';

interface TestCardProps {
  title: string;
  description: string;
  duration: number;
  onStart: () => void;
}

const TestCard: React.FC<TestCardProps> = ({ title, description, duration, onStart }) => {
  return (
    <div className="test-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="duration">⏱ Duration: {duration} minutes</p>
      <button onClick={onStart}>Start Test</button>
    </div>
  );
};

export default TestCard;
