// src/components/MockExamCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';

interface MockExamCardProps {
  id: string;
  title: string;
  description: string;
  duration: number;
  questionCount: number;
}

const MockExamCard: React.FC<MockExamCardProps> = ({ id, title, description, duration, questionCount }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{duration} minutes</span>
        <span>{questionCount} questions</span>
      </div>
      <Link 
        to={`/mock-exam/${id}`}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors inline-block text-center"
      >
        Start Exam
      </Link>
    </div>
  );
};

export default MockExamCard;