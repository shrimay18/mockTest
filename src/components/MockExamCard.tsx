// src/components/MockExamCard.tsx

import React from 'react';

interface MockExamCardProps {
  title: string;
  description: string;
  duration: number;
  questionCount: number;
}

const MockExamCard: React.FC<MockExamCardProps> = ({ title, description, duration, questionCount }) => {
  return (
    <div className="bg-gradient-to-bl from-blue-100 to-white rounded-lg shadow-md p-6 w-full hover:scale-105 transition-transform duration-300">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{duration} minutes</span>
        <span>{questionCount} questions</span>
      </div>
      <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
        Start Exam
      </button>
    </div>
  );
};

export default MockExamCard;